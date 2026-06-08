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
  Spinner,
  useDialogRef,
  useToast,
} from "@probo/ui";
import { useCallback, useState } from "react";
import { graphql, useMutation } from "react-relay";

import type { GenerateEnrollmentTokenDialogMutation } from "#/__generated__/core/GenerateEnrollmentTokenDialogMutation.graphql";

const generateTokenMutation = graphql`
  mutation GenerateEnrollmentTokenDialogMutation(
    $input: GenerateDeviceEnrollmentTokenInput!
  ) {
    generateDeviceEnrollmentToken(input: $input) {
      enrollmentToken
    }
  }
`;

type Props = {
  children: React.ReactNode;
  organizationId: string;
};

export function GenerateEnrollmentTokenDialog({
  children,
  organizationId,
}: Props) {
  const { __ } = useTranslate();
  const ref = useDialogRef();
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [mutate, isGenerating] = useMutation<GenerateEnrollmentTokenDialogMutation>(
    generateTokenMutation,
  );

  const handleGenerate = useCallback(() => {
    mutate({
      variables: {
        input: { organizationId },
      },
      onCompleted(data) {
        const enrollmentToken =
          data.generateDeviceEnrollmentToken?.enrollmentToken;
        if (enrollmentToken) {
          setToken(enrollmentToken);
        }
      },
      onError() {
        toast({
          title: __("Error"),
          description: __("Failed to generate enrollment token"),
          variant: "error",
        });
      },
    });
  }, [mutate, organizationId, toast, __]);

  const handleCopy = useCallback(async () => {
    if (!token) return;
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [token]);

  const handleClose = () => {
    setToken(null);
    setCopied(false);
  };

  return (
    <Dialog
      title={__("Generate Enrollment Token")}
      ref={ref}
      trigger={children}
      className="max-w-lg"
      onClose={handleClose}
    >
      <DialogContent padded className="space-y-4">
        <p className="text-sm text-txt-secondary">
          {__(
            "Generate a token to enroll a new device. Pass it to the agent with the --enrollment-token flag.",
          )}
        </p>

        {token ? (
          <div className="space-y-3">
            <div className="rounded-md bg-tertiary-subtle p-3">
              <p className="break-all font-mono text-sm">{token}</p>
            </div>
            <Button
              variant="secondary"
              onClick={() => void handleCopy()}
            >
              {copied ? __("Copied!") : __("Copy token")}
            </Button>
          </div>
        ) : (
          <DialogFooter>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              icon={isGenerating ? Spinner : undefined}
            >
              {__("Generate token")}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
