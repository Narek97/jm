import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    throw redirect({
      to: "/workspaces",
      replace: true,
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <></>;
}
