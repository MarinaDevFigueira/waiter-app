import { createFileRoute } from "@tanstack/react-router";
import { GoogleCallbackPage } from "@/pages/auth/google-callback/page";

export const Route = createFileRoute("/auth/google/callback")({
  component: GoogleCallbackPage,
});
