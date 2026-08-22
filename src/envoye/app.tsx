import { createRouter } from "@tanstack/react-router"
import type { QueryClient } from "@tanstack/react-query"
import {
	acceptInviteRoute,
	checkEmailRoute,
	existingWorkspaceSetupRoute,
	indexRoute,
	loginRoute,
	rootRoute,
	signupRoute,
	workspaceSetupRoute,
} from "@envoye/routing/root.ts"
import { workspaceRouteTree } from "@envoye/routing/workspace.ts"
import { adminRouteTree } from "@envoye/routing/admin.ts"

export function createEnvoyeRouter(queryClient: QueryClient) {
	const routeTree = rootRoute.addChildren([
		indexRoute,
		workspaceSetupRoute,
		existingWorkspaceSetupRoute,
		signupRoute,
		loginRoute,
		acceptInviteRoute,
		checkEmailRoute,
		workspaceRouteTree,
		adminRouteTree,
	])

	return createRouter({
		routeTree,
		context: { queryClient },
		defaultPreload: "intent",
		scrollRestoration: true,
		defaultStructuralSharing: true,
		defaultPreloadStaleTime: 0,
	})
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createEnvoyeRouter>
	}
}
