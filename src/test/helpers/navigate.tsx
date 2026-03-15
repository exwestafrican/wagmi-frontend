import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient.tsx"
import { vi } from "vitest"
import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
} from "@tanstack/react-router"
import { z } from "zod"
import { ExistingWorkspaceSetup } from "@/features/workspace/existing-workspace-setup.tsx"
import WorkspacePage from "@/features/workspace/workspace.page.tsx"

function makeTestRouter() {
	const rootRoute = createRootRoute({
		component: () => <Outlet />,
	})
	const setupRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/setup/workspace",
		validateSearch: z.object({ code: z.string() }),
		component: ExistingWorkspaceSetup,
	})

	const workspaceRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/workspace",
		validateSearch: z.object({ code: z.string() }),
		component: WorkspacePage,
	})

	return createRouter({
		routeTree: rootRoute.addChildren([setupRoute, workspaceRoute]),
		context: {},
	})
}

export async function navigateToTestPage({
	to,
	search,
	hash,
}: { to: string; search: Record<string, string>; hash?: string }) {
	const queryClient = createTestQueryClient()
	const router = makeTestRouter()
	const navigateSpy = vi.spyOn(router, "navigate") // spy BEFORE render

	if (Object.values(search).length > 0) {
		await router.navigate({ to, search })
	} else {
		await router.navigate({ to })
	}
	if (hash) {
		window.location.hash = hash
	}
	renderWithQueryClient(<RouterProvider router={router} />, { queryClient })
	return { router, navigateSpy }
}
