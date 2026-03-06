import { createFileRoute } from "@tanstack/react-router";
import { GoogleErrorPage } from "@/pages/auth/google-error/page";

export const Route = createFileRoute("/auth/google/error")({
  component: GoogleErrorPage,
});
