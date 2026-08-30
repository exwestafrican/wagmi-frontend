import { describe, expect, test, beforeEach, vi } from "vitest"
import { RouterProvider } from "@tanstack/react-router"
import { screen } from "@testing-library/react"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@common/renderWithQueryClient.tsx"
import { useAuthStore } from "@common/stores/auth.store.ts"
import { ApiPaths } from "@envoye/constants.ts"
import { WorkspaceCode } from "@envoye/test/constants.ts"
import { teammateFactory } from "@envoye/test/factory/teammate.ts"
import { WorkspaceStatus } from "@envoye/features/workspace/interface/workspace.interface.ts"
import { ENABLED_FEATURES } from "@envoye/features/feature-flag/api/feature-flags.ts"
import { CURRENT_TEAMMATE_QUERY_KEY } from "@envoye/features/workspace/api/current-teammate.ts"
import { WORKSPACE } from "@envoye/features/workspace/api/workspace.ts"
import {
	ConversationType,
	conversationListQueryKey,
} from "@envoye/features/conversation/api/list-conversation.ts"
import { WORKSPACE_TEAMMATES } from "@envoye/features/directory/api/teammates.ts"
import { chatHistoryQueryKey } from "@envoye/features/conversation/api/chat-history.ts"
import LanguageProvider from "@common/i18n/LanguageProvider.tsx"
import { mockGetUrls } from "@common/test/helpers/mocks.ts"
import { apiClient } from "@common/lib/api-client.ts"
import { makeTestRouter } from "@envoye/test/helpers/navigate.tsx"

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
