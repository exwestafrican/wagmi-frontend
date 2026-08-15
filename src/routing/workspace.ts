import { createRoute, redirect } from "@tanstack/react-router"
import WorkspacePage from "@/features/workspace/workspace.page.tsx"
import { z } from "zod"
import { rootRoute } from "@/routing/root.ts"
import WorkspaceDirectoryPage from "@/features/directory/workspace-directory-page.tsx"
import NotFound from "@/features/not-found.tsx"
import { NewConversationPage } from "@/features/conversation/new-conversation.page.tsx"
import { handleAuthToken } from "@/features/auth/hooks/handle-auth-token.ts"
import { Pages } from "@/utils/pages"
import { ensureWorkspaceSession } from "@/features/workspace/api/ensure-workspace-session.ts"
import { WorkspacePending } from "@/features/workspace/components/workspace-pending.tsx"
import { chatHistoryQueryOptions } from "@/features/conversation/api/chat-history.ts"

export const workspaceLayoutRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "workspace",
	notFoundComponent: NotFound,
	validateSearch: (search) => z.object({ code: z.string() }).parse(search),
	beforeLoad: ({ location }) => {
		handleAuthToken(location, Pages.LOGIN)
	},
	loaderDeps: ({ search: { code } }) => ({ code }),
	loader: async ({ context: { queryClient }, deps: { code } }) => {
		await ensureWorkspaceSession(queryClient, code)
	},
	pendingComponent: WorkspacePending,
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
	loaderDeps: ({ search }) => ({
		code: search.code,
		conversationId: search.conversationId,
	}),
	loader: async ({ context: { queryClient }, deps: { code, conversationId } }) => {
		await queryClient.ensureQueryData(
			chatHistoryQueryOptions(code, conversationId),
		)
	},
	pendingComponent: WorkspacePending,
	component: NewConversationPage,
})

export const workspaceRouteTree = workspaceLayoutRoute.addChildren([
	workspaceIndexRoute,
	workspaceDirectoryRoute,
	conversationRoute,
])
