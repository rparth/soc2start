// Copyright (c) 2026 Probo Inc <hello@getprobo.com>.
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
// AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
// LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
// OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THIS SOFTWARE.

package agent_v1

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"go.gearno.de/kit/httpserver"
	"go.gearno.de/kit/log"
	"go.probo.inc/probo/pkg/coredata"
	"go.probo.inc/probo/pkg/probo"
)

const (
	defaultHeartbeatSeconds = 300
	defaultPostureSeconds   = 900
	maxRequestBodySize      = 2 << 20 // 2 MB
)

type Handler struct {
	logger    *log.Logger
	deviceSvc *probo.DeviceService
}

func NewMux(
	logger *log.Logger,
	deviceSvc *probo.DeviceService,
) *chi.Mux {
	h := &Handler{
		logger:    logger,
		deviceSvc: deviceSvc,
	}

	r := chi.NewRouter()

	r.Post("/enroll", h.handleEnroll)
	r.Post("/heartbeat", h.handleHeartbeat)
	r.Post("/postures", h.handlePostures)
	r.Post("/unenroll", h.handleUnenroll)

	return r
}

type enrollRequest struct {
	EnrollmentToken string  `json:"enrollment_token"`
	HardwareUUID    string  `json:"hardware_uuid"`
	SerialNumber    *string `json:"serial_number,omitempty"`
	Hostname        string  `json:"hostname"`
	Platform        string  `json:"platform"`
	OSVersion       string  `json:"os_version"`
	AgentVersion    string  `json:"agent_version"`
}

type enrollResponse struct {
	DeviceID         string `json:"device_id"`
	APIKey           string `json:"api_key"`
	HeartbeatSeconds int    `json:"heartbeat_interval_seconds"`
	PostureSeconds   int    `json:"posture_interval_seconds"`
	ServerTime       string `json:"server_time"`
}

func (h *Handler) handleEnroll(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	var req enrollRequest
	if err := readJSON(r, &req); err != nil {
		httpserver.RenderJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
		return
	}

	if req.EnrollmentToken == "" || req.HardwareUUID == "" {
		httpserver.RenderJSON(w, http.StatusBadRequest, map[string]string{"error": "enrollment_token and hardware_uuid are required"})
		return
	}

	device, apiKey, err := h.deviceSvc.Enroll(
		ctx,
		req.EnrollmentToken,
		req.HardwareUUID,
		req.SerialNumber,
		req.Hostname,
		req.Platform,
		req.OSVersion,
		req.AgentVersion,
	)
	if err != nil {
		h.logger.ErrorCtx(ctx, "cannot enroll device", log.Error(err))
		httpserver.RenderJSON(w, http.StatusUnauthorized, map[string]string{"error": "enrollment failed"})
		return
	}

	httpserver.RenderJSON(w, http.StatusOK, enrollResponse{
		DeviceID:         device.ID.String(),
		APIKey:           apiKey,
		HeartbeatSeconds: defaultHeartbeatSeconds,
		PostureSeconds:   defaultPostureSeconds,
		ServerTime:       time.Now().UTC().Format(time.RFC3339),
	})
}

type heartbeatRequest struct {
	AgentVersion string `json:"agent_version,omitempty"`
	Hostname     string `json:"hostname,omitempty"`
	OSVersion    string `json:"os_version,omitempty"`
}

type heartbeatResponse struct {
	HeartbeatSeconds int    `json:"heartbeat_interval_seconds"`
	PostureSeconds   int    `json:"posture_interval_seconds"`
	ServerTime       string `json:"server_time"`
}

func (h *Handler) handleHeartbeat(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	device, err := h.authenticateDevice(r)
	if err != nil {
		httpserver.RenderJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}

	var req heartbeatRequest
	if err := readJSON(r, &req); err != nil {
		httpserver.RenderJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
		return
	}

	_, err = h.deviceSvc.Heartbeat(
		ctx,
		device.ID,
		req.AgentVersion,
		req.Hostname,
		req.OSVersion,
	)
	if err != nil {
		h.logger.ErrorCtx(ctx, "heartbeat failed", log.Error(err))
		httpserver.RenderJSON(w, http.StatusInternalServerError, map[string]string{"error": "heartbeat failed"})
		return
	}

	httpserver.RenderJSON(w, http.StatusOK, heartbeatResponse{
		HeartbeatSeconds: defaultHeartbeatSeconds,
		PostureSeconds:   defaultPostureSeconds,
		ServerTime:       time.Now().UTC().Format(time.RFC3339),
	})
}

type posturesRequest struct {
	Results []probo.PostureResult `json:"results"`
}

func (h *Handler) handlePostures(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	device, err := h.authenticateDevice(r)
	if err != nil {
		httpserver.RenderJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}

	var req posturesRequest
	if err := readJSON(r, &req); err != nil {
		httpserver.RenderJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
		return
	}

	if len(req.Results) == 0 {
		httpserver.RenderJSON(w, http.StatusOK, map[string]string{"status": "ok"})
		return
	}

	if err := h.deviceSvc.PushPostures(ctx, device.ID, req.Results); err != nil {
		h.logger.ErrorCtx(ctx, "cannot push postures", log.Error(err))
		httpserver.RenderJSON(w, http.StatusInternalServerError, map[string]string{"error": "posture push failed"})
		return
	}

	httpserver.RenderJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (h *Handler) handleUnenroll(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()

	device, err := h.authenticateDevice(r)
	if err != nil {
		httpserver.RenderJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}

	if err := h.deviceSvc.Unenroll(ctx, device.ID); err != nil {
		h.logger.ErrorCtx(ctx, "cannot unenroll device", log.Error(err))
		httpserver.RenderJSON(w, http.StatusInternalServerError, map[string]string{"error": "unenroll failed"})
		return
	}

	httpserver.RenderJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (h *Handler) authenticateDevice(r *http.Request) (*coredata.Device, error) {
	auth := r.Header.Get("Authorization")
	if len(auth) < 8 || auth[:7] != "Bearer " {
		return nil, fmt.Errorf("missing bearer token")
	}

	apiKey := auth[7:]

	device, err := h.deviceSvc.GetByAPIKey(r.Context(), apiKey)
	if err != nil {
		return nil, err
	}

	if device.Status == coredata.DeviceStatusRevoked {
		return nil, fmt.Errorf("device is revoked")
	}

	return device, nil
}

func readJSON(r *http.Request, v any) error {
	body := io.LimitReader(r.Body, maxRequestBodySize)
	return json.NewDecoder(body).Decode(v)
}
