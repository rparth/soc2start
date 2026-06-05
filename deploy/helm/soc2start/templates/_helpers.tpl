{{/*
Chart name.
*/}}
{{- define "soc2start.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Fully qualified app name.
*/}}
{{- define "soc2start.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Common labels.
*/}}
{{- define "soc2start.labels" -}}
helm.sh/chart: {{ include "soc2start.name" . }}-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
app.kubernetes.io/version: {{ .Values.probo.image.tag | default .Chart.AppVersion | quote }}
{{ include "soc2start.selectorLabels" . }}
{{- end }}

{{/*
Selector labels.
*/}}
{{- define "soc2start.selectorLabels" -}}
app.kubernetes.io/name: {{ include "soc2start.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
ServiceAccount name.
*/}}
{{- define "soc2start.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "soc2start.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Probo image reference.
*/}}
{{- define "soc2start.proboImage" -}}
{{ .Values.probo.image.repository }}:{{ .Values.probo.image.tag | default .Chart.AppVersion }}
{{- end }}

{{/*
PostgreSQL host.
*/}}
{{- define "soc2start.pgHost" -}}
{{- if .Values.postgres.enabled }}
{{- printf "%s-postgres" (include "soc2start.fullname" .) }}
{{- else }}
{{- .Values.postgres.external.host }}
{{- end }}
{{- end }}

{{/*
PostgreSQL port.
*/}}
{{- define "soc2start.pgPort" -}}
{{- if .Values.postgres.enabled }}
{{- "5432" }}
{{- else }}
{{- .Values.postgres.external.port | default "5432" }}
{{- end }}
{{- end }}

{{/*
PostgreSQL address (host:port).
*/}}
{{- define "soc2start.pgAddr" -}}
{{ include "soc2start.pgHost" . }}:{{ include "soc2start.pgPort" . }}
{{- end }}

{{/*
SeaweedFS S3 endpoint.
*/}}
{{- define "soc2start.s3Endpoint" -}}
{{- if .Values.seaweedfs.enabled }}
{{- printf "http://%s-seaweedfs:%d" (include "soc2start.fullname" .) (int .Values.seaweedfs.service.s3Port) }}
{{- else }}
{{- .Values.aws.endpoint }}
{{- end }}
{{- end }}

{{/*
Chrome address.
*/}}
{{- define "soc2start.chromeAddr" -}}
{{- printf "%s-chrome:%d" (include "soc2start.fullname" .) (int .Values.chrome.service.port) }}
{{- end }}

{{/*
Probo base URL.
*/}}
{{- define "soc2start.baseURL" -}}
{{- if .Values.probo.baseURL }}
{{- .Values.probo.baseURL }}
{{- else }}
{{- printf "https://%s" .Values.global.domain }}
{{- end }}
{{- end }}

{{/*
Probo secret name.
*/}}
{{- define "soc2start.proboSecretName" -}}
{{- if .Values.probo.existingSecret }}
{{- .Values.probo.existingSecret }}
{{- else }}
{{- printf "%s-probo" (include "soc2start.fullname" .) }}
{{- end }}
{{- end }}

{{/*
PostgreSQL secret name.
*/}}
{{- define "soc2start.pgSecretName" -}}
{{- if .Values.postgres.auth.existingSecret }}
{{- .Values.postgres.auth.existingSecret }}
{{- else }}
{{- printf "%s-postgres" (include "soc2start.fullname" .) }}
{{- end }}
{{- end }}

{{/*
AWS secret name.
*/}}
{{- define "soc2start.awsSecretName" -}}
{{- if .Values.aws.existingSecret }}
{{- .Values.aws.existingSecret }}
{{- else }}
{{- printf "%s-aws" (include "soc2start.fullname" .) }}
{{- end }}
{{- end }}

{{/*
Ingress host.
*/}}
{{- define "soc2start.ingressHost" -}}
{{- .Values.ingress.host | default .Values.global.domain }}
{{- end }}

{{/*
Cloudflare inbound CIDRs as a comma-separated string.
*/}}
{{- define "soc2start.cloudflareInboundCidrs" -}}
{{- $all := concat .Values.ingress.cloudflare.ipv4 .Values.ingress.cloudflare.ipv6 .Values.ingress.cloudflare.extraIPs }}
{{- join ", " $all }}
{{- end }}
