import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/_authenticated/_primary-sidebar-layout/settings/",
)({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className={"h-full"}>se</div>;
}
