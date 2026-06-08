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

import { useTranslate } from "@probo/i18n";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  Dropzone,
  Field,
  Input,
  Spinner,
  useDialogRef,
} from "@probo/ui";
import { useState } from "react";
import { graphql } from "relay-runtime";
import { z } from "zod";

import { useFormWithSchema } from "#/hooks/useFormWithSchema";
import { useMutationWithToasts } from "#/hooks/useMutationWithToasts";

const createMonitoringReportMutation = graphql`
  mutation UploadMonitoringReportDialogMutation(
    $input: CreateMonitoringReportInput!
    $connections: [ID!]!
  ) {
    createMonitoringReport(input: $input) {
      monitoringReportEdge @appendEdge(connections: $connections) {
        node {
          id
          name
          reportType
          rowCount
          createdAt
          uploader {
            id
            fullName
          }
          canDelete: permission(action: "core:monitoring-report:delete")
        }
      }
    }
  }
`;

const schema = z.object({
  name: z.string().min(1, "Name is required"),
});

type Props = {
  children: React.ReactNode;
  organizationId: string;
  reportType: "PROWLER" | "PENTEST";
  connectionId: string;
  onSuccess?: () => void;
};

export function UploadMonitoringReportDialog({
  children,
  organizationId,
  reportType,
  connectionId,
  onSuccess,
}: Props) {
  const { __ } = useTranslate();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const ref = useDialogRef();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setValue,
  } = useFormWithSchema(schema, {
    defaultValues: {
      name: "",
    },
  });

  const [mutate] = useMutationWithToasts(createMonitoringReportMutation, {
    successMessage: __("Report uploaded successfully"),
    errorMessage: __("Failed to upload report"),
  });

  const handleDrop = (files: File[]) => {
    if (files.length > 0) {
      setUploadedFile(files[0]);
      setValue("name", files[0].name.replace(/\.[^/.]+$/, ""));
    }
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    if (!uploadedFile) {
      return;
    }

    await mutate({
      variables: {
        connections: [connectionId],
        input: {
          organizationId,
          reportType,
          name: data.name,
          file: null,
        },
      },
      uploadables: {
        "input.file": uploadedFile,
      },
    });

    reset();
    setUploadedFile(null);
    onSuccess?.();
    ref.current?.close();
  };

  const handleClose = () => {
    reset();
    setUploadedFile(null);
  };

  const title =
    reportType === "PROWLER"
      ? __("Upload Prowler Report")
      : __("Upload Pentesting Report");

  return (
    <Dialog
      title={title}
      ref={ref}
      trigger={children}
      className="max-w-lg"
      onClose={handleClose}
    >
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
        <DialogContent padded className="space-y-4">
          <Dropzone
            description={__("CSV files up to 50MB")}
            isUploading={isSubmitting}
            onDrop={handleDrop}
            accept={{
              "text/csv": [".csv"],
              "application/vnd.ms-excel": [".csv"],
            }}
            maxSize={50}
          />

          {uploadedFile && (
            <div className="rounded-md bg-tertiary-subtle p-3">
              <p className="text-sm font-medium">
                {__("Selected file")}:
              </p>
              <p className="text-sm text-txt-secondary">{uploadedFile.name}</p>
            </div>
          )}

          <Field label={__("Report name")} required>
            <Input {...register("name")} required />
          </Field>
        </DialogContent>

        <DialogFooter>
          <Button
            type="submit"
            disabled={isSubmitting || !uploadedFile}
            icon={isSubmitting ? Spinner : undefined}
          >
            {__("Upload")}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
