import { createFileRoute } from "@tanstack/react-router";
import { AdminPage } from "@/pages/admin/admin-page";

export const Route = createFileRoute("/dashboard/")({
  component: () => <AdminPage />,
});
