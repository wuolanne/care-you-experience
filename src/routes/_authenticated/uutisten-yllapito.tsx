import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/uutisten-yllapito")({
  beforeLoad: () => {
    throw redirect({ to: "/admin/uutiset" });
  },
});
