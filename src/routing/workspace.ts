import { createRoute, redirect } from "@tanstack/react-router"
import WorkspacePage from "@/features/workspace/workspace.page.tsx"
import { z } from "zod"
import { rootRoute } from "@/routing/root.ts"
import WorkspaceDirectoryPage from "@/features/directory/workspace-directory-page.tsx"
import NotFound from "@/features/not-found.tsx"
import { NewConversationPage } from "@/features/conversation/new-conversation.page.tsx"
import { handleAuthToken } from "@/features/auth/hooks/handle-auth-token.ts"
import { Pages } from "@/utils/pages"

export const workspaceLayoutRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "workspace",
	notFoundComponent: NotFound,
	validateSearch: (search) => z.object({ code: z.string() }).parse(search),
	beforeLoad: ({ location }) => {
		handleAuthToken(location, Pages.LOGIN)
		//TODO: Load a bunch things here, like feature flags, permissions, teammates, conversation summeries, etc. and then navigate to the workspace directory page
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

const conversationRoute = createRoute({
	getParentRoute: () => workspaceLayoutRoute,
	path: "conversation",
	validateSearch: (search) =>
		z
			.object({
				conversationId: z.number(),
			})
			.parse(search),
	component: NewConversationPage,
})

export const workspaceRouteTree = workspaceLayoutRoute.addChildren([
	workspaceIndexRoute,
	workspaceDirectoryRoute,
	conversationRoute,
])
