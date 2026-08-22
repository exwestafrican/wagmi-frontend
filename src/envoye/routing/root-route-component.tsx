import { Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { Toaster } from "sonner"

export function RootRouteComponent() {
	return (
		<>
			<Outlet />
			<div data-testid="toaster">
				<Toaster richColors position="top-right" />
			</div>
			<TanStackRouterDevtools />
		</>
	)
}
