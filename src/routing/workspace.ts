import { createRoute, redirect } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/auth.store.ts"
import { Pages } from "@/utils/pages.ts"
import WorkspacePage from "@/features/workspace/workspace.page.tsx"
import { z } from "zod"
import { rootRoute } from "@/routing/root.ts"
import WorkspaceDirectoryPage from "@/features/directory/workspace-directory-page.tsx"
import NotFound from "@/features/not-found.tsx"
import { BackfillJobsPage } from "@/features/jobs/backfill-jobs-page.tsx"

export const workspaceLayoutRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "workspace",
	notFoundComponent: NotFound,
	validateSearch: (search) => z.object({ code: z.string() }).parse(search),
	beforeLoad: ({ location }) => {
		const token = useAuthStore.getState().token
		if (!token) {
			throw redirect({ to: Pages.LOGIN, search: { redirect: location.href } })
		}
	},
	component: WorkspacePage,
})

const workspaceIndexRoute = createRoute({
	getParentRoute: () => workspaceLayoutRoute,
	path: "/",
	beforeLoad: ({ search }) => {
		throw redirect({
			to: "/workspace/directory",
			search: { code: search.code },
		})
	},
})

const workspaceDirectoryRoute = createRoute({
	getParentRoute: () => workspaceLayoutRoute,
	path: "directory",
	component: WorkspaceDirectoryPage,
})

const internalRoute = createRoute({
	getParentRoute: () => workspaceLayoutRoute,
	path: "internal",
	component: BackfillJobsPage,
})

export const workspaceRouteTree = workspaceLayoutRoute.addChildren([
	workspaceIndexRoute,
	workspaceDirectoryRoute,
	internalRoute,
])
