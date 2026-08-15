import { describe, expect, test, beforeEach, vi } from "vitest"
import { RouterProvider } from "@tanstack/react-router"
import { screen } from "@testing-library/react"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient.tsx"
import { useAuthStore } from "@/stores/auth.store.ts"
import { ApiPaths } from "@/constants.ts"
import { WorkspaceCode } from "@/test/constants.ts"
import { teammateFactory } from "@/test/factory/teammate.ts"
import { WorkspaceStatus } from "@/features/workspace/interface/workspace.interface.ts"
import { ENABLED_FEATURES } from "@/features/feature-flag/api/feature-flags.ts"
import { CURRENT_TEAMMATE_QUERY_KEY } from "@/features/workspace/api/current-teammate.ts"
import { WORKSPACE } from "@/features/workspace/api/workspace.ts"
import {
	ConversationType,
	conversationListQueryKey,
} from "@/features/conversation/api/list-conversation.ts"
import { WORKSPACE_TEAMMATES } from "@/features/directory/api/teammates.ts"
import { chatHistoryQueryKey } from "@/features/conversation/api/chat-history.ts"
import LanguageProvider from "@/i18n/LanguageProvider.tsx"
import { mockGetUrls } from "@/test/helpers/mocks.ts"
import { apiClient } from "@/lib/api-client.ts"
import { makeTestRouter } from "@/test/helpers/navigate.tsx"

describe("workspaceLayoutRoute loader", () => {
	const envoyeWorkspace = {
		code: WorkspaceCode.ENVOYE,
		name: "Envoye",
		status: WorkspaceStatus.ACTIVE,
	}
	const sidebarTeammate = teammateFactory.build({
		username: "loader.test.user",
	})
	const enabledFeatures = ["can_integrate_whatsapp"]
	const conversationId = 42
	const chatHistory = [
		{
			id: 1,
			authorId: sidebarTeammate.id,
			sentAt: Date.now(),
			content: ["hello from email"],
			type: "text",
		},
	]

	beforeEach(() => {
		useAuthStore.getState().clearAuthToken()
		mockGetUrls()
			.url(ApiPaths.WORKSPACE)
			.respond(envoyeWorkspace)
			.url(ApiPaths.CURRENT_TEAMMATE)
			.respond(sidebarTeammate)
			.url(ApiPaths.FEATURE_FLAGS_ENABLED)
			.respond(enabledFeatures)
			.url(ApiPaths.CONVERSATIONS)
			.respond([])
			.url(ApiPaths.ACTIVE_TEAMMATES)
			.respond([sidebarTeammate])
			.url(ApiPaths.CONVERSATION_CHAT_HISTORY)
			.respond(chatHistory)
			.apply()
	})

	test("prefetches workspace session data before rendering workspace UI", async () => {
		useAuthStore.getState().setAuthToken("fake-token")
		const queryClient = createTestQueryClient()
		const router = makeTestRouter(queryClient)

		await router.navigate({
			to: "/workspace/directory",
			search: { code: envoyeWorkspace.code },
		})

		expect(
			queryClient.getQueryData([WORKSPACE, envoyeWorkspace.code]),
		).toBeDefined()
		expect(
			queryClient.getQueryData([
				CURRENT_TEAMMATE_QUERY_KEY,
				envoyeWorkspace.code,
			]),
		).toEqual(sidebarTeammate)
		expect(
			queryClient.getQueryData([ENABLED_FEATURES, envoyeWorkspace.code]),
		).toEqual(enabledFeatures)
		expect(
			queryClient.getQueryData(
				conversationListQueryKey(
					envoyeWorkspace.code,
					sidebarTeammate.id,
					ConversationType.PRIVATE,
				),
			),
		).toEqual([])
		expect(
			queryClient.getQueryData(
				conversationListQueryKey(
					envoyeWorkspace.code,
					sidebarTeammate.id,
					ConversationType.COLLABORATIVE,
				),
			),
		).toEqual([])
		expect(
			queryClient.getQueryData([WORKSPACE_TEAMMATES, envoyeWorkspace.code]),
		).toEqual([sidebarTeammate])

		renderWithQueryClient(
			<LanguageProvider>
				<RouterProvider router={router} context={{ queryClient }} />
			</LanguageProvider>,
			{ queryClient },
		)

		expect(
			await screen.findByText(sidebarTeammate.username),
		).toBeInTheDocument()

		const workspaceCalls = vi
			.mocked(apiClient.get)
			.mock.calls.filter(([url]) => url === ApiPaths.WORKSPACE)
		const teammateCalls = vi
			.mocked(apiClient.get)
			.mock.calls.filter(([url]) => url === ApiPaths.CURRENT_TEAMMATE)
		const featureFlagCalls = vi
			.mocked(apiClient.get)
			.mock.calls.filter(([url]) => url === ApiPaths.FEATURE_FLAGS_ENABLED)

		expect(workspaceCalls).toHaveLength(1)
		expect(teammateCalls).toHaveLength(1)
		expect(featureFlagCalls).toHaveLength(1)
	})

	test("prefetches chat history when deep-linking to a conversation", async () => {
		useAuthStore.getState().setAuthToken("fake-token")
		const queryClient = createTestQueryClient()
		const router = makeTestRouter(queryClient)

		await router.navigate({
			to: "/workspace/conversation",
			search: {
				code: envoyeWorkspace.code,
				conversationId,
			},
		})

		expect(
			queryClient.getQueryData(
				chatHistoryQueryKey(envoyeWorkspace.code, conversationId),
			),
		).toBeDefined()
		expect(
			queryClient.getQueryData(
				conversationListQueryKey(
					envoyeWorkspace.code,
					sidebarTeammate.id,
					ConversationType.PRIVATE,
				),
			),
		).toEqual([])

		const chatHistoryCalls = vi
			.mocked(apiClient.get)
			.mock.calls.filter(([url]) => url === ApiPaths.CONVERSATION_CHAT_HISTORY)
		expect(chatHistoryCalls).toHaveLength(1)
	})

	test("does not prefetch chat history when opening a new conversation", async () => {
		useAuthStore.getState().setAuthToken("fake-token")
		const queryClient = createTestQueryClient()
		const router = makeTestRouter(queryClient)

		await router.navigate({
			to: "/workspace/conversation",
			search: {
				code: envoyeWorkspace.code,
				conversationId: 0,
			},
		})

		expect(router.state.location.pathname).toBe("/workspace/conversation")
		expect(
			queryClient.getQueryData(chatHistoryQueryKey(envoyeWorkspace.code, 0)),
		).toBeUndefined()
	})

	test("redirects to login when no auth token is present", async () => {
		const queryClient = createTestQueryClient()
		const router = makeTestRouter(queryClient)

		await router.navigate({
			to: "/workspace/directory",
			search: { code: envoyeWorkspace.code },
		})

		expect(router.state.location.pathname).toBe("/login")
		expect(apiClient.get).not.toHaveBeenCalled()
	})
})
