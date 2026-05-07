import { Resend } from "resend";

const apiKey = process.env.AUTH_RESEND_KEY;

export const resend: Resend | null = apiKey ? new Resend(apiKey) : null;

export const FROM_EMAIL =
  process.env.AUTH_EMAIL_FROM || "onboarding@resend.dev";
export const BRAND_NAME = "& Le Quotidien des IA";

export function fromHeader(): string {
  return `${BRAND_NAME} <${FROM_EMAIL}>`;
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}
