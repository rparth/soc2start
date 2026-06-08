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

import { formatError } from "@probo/helpers";
import { usePageTitle } from "@probo/hooks";
import { useTranslate } from "@probo/i18n";
import { Button, Field, useToast } from "@probo/ui";
import { useState } from "react";
import { useMutation } from "react-relay";
import { Link, useSearchParams } from "react-router";
import { graphql } from "relay-runtime";
import { z } from "zod";

import type { VerifyEmailPageMutation } from "#/__generated__/iam/VerifyEmailPageMutation.graphql";
import type { VerifyEmailPageResendMutation } from "#/__generated__/iam/VerifyEmailPageResendMutation.graphql";
import { useFormWithSchema } from "#/hooks/useFormWithSchema";

const verifyEmailMutation = graphql`
  mutation VerifyEmailPageMutation($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      success
    }
  }
`;

const resendVerificationEmailMutation = graphql`
  mutation VerifyEmailPageResendMutation($input: ResendVerificationEmailInput!) {
    resendVerificationEmail(input: $input) {
      success
    }
  }
`;

const confirmEmailSchema = z.object({
  token: z.string().min(1, "Please enter a confirmation token"),
});

const resendEmailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export default function VerifyEmailPage() {
  const { __ } = useTranslate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  usePageTitle(__("Confirm Email"));

  const [isConfirmed, setIsConfirmed] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resendSent, setResendSent] = useState(false);

  const form = useFormWithSchema(confirmEmailSchema, {
    defaultValues: {
      token: searchParams.get("token") ?? "",
    },
  });

  const resendForm = useFormWithSchema(resendEmailSchema, {
    defaultValues: {
      email: "",
    },
  });

  const [verifyEmail]
    = useMutation<VerifyEmailPageMutation>(verifyEmailMutation);

  const [resendVerificationEmail]
    = useMutation<VerifyEmailPageResendMutation>(resendVerificationEmailMutation);

  const handleSubmit = form.handleSubmit((data) => {
    verifyEmail({
      variables: {
        input: {
          token: data.token.trim(),
        },
      },
      onCompleted: (_, errors) => {
        if (errors) {
          const errorMessage = errors[0]?.message ?? "";
          const isExpired = errorMessage.toLowerCase().includes("expired");

          toast({
            title: __("Error"),
            description: isExpired
              ? __("Your confirmation link has expired. Request a new one below.")
              : formatError(__("Failed to confirm email"), errors),
            variant: "error",
          });

          if (isExpired) {
            setShowResend(true);
          }
          return;
        }

        setIsConfirmed(true);
        toast({
          title: __("Success"),
          description: __("Your email has been confirmed successfully"),
          variant: "success",
        });
      },
      onError: (err) => {
        toast({
          title: __("Error"),
          description: err.message || __("Failed to confirm email"),
          variant: "error",
        });
      },
    });
  });

  const handleResend = resendForm.handleSubmit((data) => {
    resendVerificationEmail({
      variables: {
        input: {
          email: data.email.trim(),
        },
      },
      onCompleted: () => {
        setResendSent(true);
        toast({
          title: __("Email sent"),
          description: __("If an account exists with that email, a new verification link has been sent."),
          variant: "success",
        });
      },
      onError: () => {
        toast({
          title: __("Error"),
          description: __("Failed to send verification email. Please try again."),
          variant: "error",
        });
      },
    });
  });

  return (
    <div className="w-full max-w-md mx-auto pt-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">{__("Email Confirmation")}</h1>
        <p className="mt-2 text-sm text-txt-tertiary">
          {__("Confirm your email address to complete registration")}
        </p>
      </div>

      {isConfirmed
        ? (
            <div className="text-center space-y-6">
              <div className="mx-auto w-12 h-12 rounded-full bg-txt-success/10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-txt-success">
                  <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-sm text-txt-success font-medium">
                {__("Your email has been confirmed successfully!")}
              </p>
              <Button to="/auth/login" className="w-full h-10">
                {__("Proceed to Login")}
              </Button>
            </div>
          )
        : (
            <>
              <form onSubmit={e => void handleSubmit(e)} className="space-y-5">
                <Field
                  label={__("Confirmation Token")}
                  type="text"
                  placeholder={__("Enter your confirmation token")}
                  {...form.register("token")}
                  error={form.formState.errors.token?.message}
                  disabled={form.formState.isSubmitting}
                  help={__(
                    "The token has been automatically filled from the URL if available",
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-10"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? __("Confirming...")
                    : __("Confirm Email")}
                </Button>
              </form>

              {showResend && (
                <div className="mt-8 pt-6 border-t border-bd-default">
                  <p className="text-sm text-txt-secondary text-center mb-4">
                    {__("Request a new verification email")}
                  </p>
                  {resendSent
                    ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-txt-success">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                            <path d="M13 4L6 11.5L3 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="font-medium">{__("Check your inbox for a new verification link.")}</span>
                        </div>
                      )
                    : (
                        <form onSubmit={e => void handleResend(e)} className="space-y-4">
                          <Field
                            label={__("Email Address")}
                            type="email"
                            placeholder={__("Enter your email address")}
                            {...resendForm.register("email")}
                            error={resendForm.formState.errors.email?.message}
                            disabled={resendForm.formState.isSubmitting}
                          />
                          <Button
                            type="submit"
                            variant="secondary"
                            className="w-full h-10"
                            disabled={resendForm.formState.isSubmitting}
                          >
                            {resendForm.formState.isSubmitting
                              ? __("Sending...")
                              : __("Resend Verification Email")}
                          </Button>
                        </form>
                      )}
                </div>
              )}

              <div className="mt-6 text-center">
                <button
                  type="button"
                  className="text-sm text-txt-tertiary hover:text-txt-secondary transition-colors"
                  onClick={() => setShowResend(!showResend)}
                >
                  {showResend
                    ? __("Hide resend form")
                    : __("Didn't receive the email?")}
                </button>
              </div>
            </>
          )}

      <div className="mt-6 text-center">
        {!isConfirmed && (
          <Link
            to="/auth/login"
            className="text-sm text-txt-tertiary hover:text-txt-primary transition-colors"
          >
            {__("Back to Login")}
          </Link>
        )}
      </div>
    </div>
  );
}
