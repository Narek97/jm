import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_primary-sidebar-layout/admin/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className={"h-full bg-red-300"}></div>;
}
