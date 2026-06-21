import { createRoute, redirect } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/auth.store.ts"
import { Pages } from "@/utils/pages.ts"
import WorkspacePage from "@/features/workspace/workspace.page.tsx"
import { z } from "zod"
import { rootRoute } from "@/routing/root.ts"
import WorkspaceDirectoryPage from "@/features/directory/workspace-directory-page.tsx"
import NotFound from "@/features/not-found.tsx"
import TeammateConversation from "@/features/conversation/page.tsx"
import { NewConversationPage } from "@/features/conversation/new-conversation.page.tsx"

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

const conversationRoute = createRoute({
	getParentRoute: () => workspaceLayoutRoute,
	path: "conversation",
	validateSearch: (search) =>
		z
			.object({
				conversationId: z.number(),
			})
			.parse(search),
	component: TeammateConversation,
})

const newConversationPoute = createRoute({
	getParentRoute: () => workspaceLayoutRoute,
	path: "new-conversation",
	component: NewConversationPage,
    validateSearch: z.object({conversationId: z.number().optional()})

})

export const workspaceRouteTree = workspaceLayoutRoute.addChildren([
	workspaceIndexRoute,
	workspaceDirectoryRoute,
	conversationRoute,
	newConversationPoute,
])
