import { createRoute, redirect } from "@tanstack/react-router"
import WorkspacePage from "@envoye/features/workspace/workspace.page.tsx"
import { z } from "zod"
import { rootRoute } from "@envoye/routing/root.ts"
import WorkspaceDirectoryPage from "@envoye/features/directory/workspace-directory-page.tsx"
import NotFound from "@envoye/features/not-found.tsx"
import { NewConversationPage } from "@envoye/features/conversation/new-conversation.page.tsx"
import { handleAuthToken } from "@envoye/features/auth/hooks/handle-auth-token.ts"
import { Pages } from "@common/utils/pages"
import { ensureWorkspaceSession } from "@envoye/features/workspace/api/ensure-workspace-session.ts"
import { WorkspacePending } from "@envoye/features/workspace/components/workspace-pending.tsx"
import { chatHistoryQueryOptions } from "@envoye/features/conversation/api/chat-history.ts"

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
	loader: async ({
		context: { queryClient },
		deps: { code, conversationId },
	}) => {
		if (conversationId <= 0) return
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
