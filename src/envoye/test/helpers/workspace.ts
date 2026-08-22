import type { QueryClient } from "@tanstack/react-query"
import type { Workspace } from "@envoye/features/workspace/interface/workspace.interface.ts"
import type { Teammate } from "@envoye/features/workspace/interface/teammate.interface.ts"
import {
	type ConversationApiResponse,
	ConversationType,
	conversationListQueryKey,
	TEAMMATE_CONVERSATION_LIST,
	toConversationSummary,
} from "@envoye/features/conversation/api/list-conversation.ts"
import { teammateFactory } from "@envoye/test/factory/teammate.ts"
import { useAuthStore } from "@common/stores/auth.store.ts"
import { navigateToTestPage } from "@envoye/test/helpers/navigate.tsx"
import { mockGetUrls } from "@common/test/helpers/mocks.ts"
import { ApiPaths } from "@envoye/constants.ts"
import { act } from "@testing-library/react"

export function seedConversationCache(
	queryClient: QueryClient,
	workspaceCode: string,
	teammateId: number,
	conversations: ConversationApiResponse[] = [],
	collaborativeConversations: ConversationApiResponse[] = [],
) {
	const privateSummaries = conversations.map((raw) =>
		toConversationSummary(raw, teammateId),
	)
	const collaborativeSummaries = collaborativeConversations.map((raw) =>
		toConversationSummary(raw, teammateId),
	)

	queryClient.setQueryDefaults([TEAMMATE_CONVERSATION_LIST], {
		staleTime: Number.POSITIVE_INFINITY,
	})

	queryClient.setQueryData(
		conversationListQueryKey(
			workspaceCode,
			teammateId,
			ConversationType.PRIVATE,
		),
		privateSummaries,
	)
	queryClient.setQueryData(
		conversationListQueryKey(
			workspaceCode,
			teammateId,
			ConversationType.COLLABORATIVE,
		),
		collaborativeSummaries,
	)
}

export async function navigateToWorkspacePage(
	workspace: Workspace,
	teammate: Teammate = teammateFactory.build(),
	workspaceTeammates: Teammate[] = [],
	conversations: ConversationApiResponse[] = [],
	collaborativeConversations: ConversationApiResponse[] = [],
) {
	return await act(async () => {
		useAuthStore.getState().setAuthToken("fake-token")
		mockWorkspaceAndCurrentTeammate(workspace, teammate, workspaceTeammates)
		return await navigateToTestPage({
			to: "/workspace/directory",
			search: { code: workspace.code },
			seedQueryCache: (queryClient) =>
				seedConversationCache(
					queryClient,
					workspace.code,
					teammate.id,
					conversations,
					collaborativeConversations,
				),
		})
	})
}

export async function navigateToConversationPage(
	workspace: Workspace,
	teammate: Teammate,
	workspaceTeammates: Teammate[],
	conversations: ConversationApiResponse[],
	conversationId: number,
	collaborativeConversations: ConversationApiResponse[] = [],
) {
	return await act(async () => {
		useAuthStore.getState().setAuthToken("fake-token")
		mockWorkspaceAndCurrentTeammate(workspace, teammate, workspaceTeammates)
		return await navigateToTestPage({
			to: "/workspace/conversation",
			search: { code: workspace.code, conversationId },
			seedQueryCache: (queryClient) =>
				seedConversationCache(
					queryClient,
					workspace.code,
					teammate.id,
					conversations,
					collaborativeConversations,
				),
		})
	})
}

export function mockWorkspaceAndCurrentTeammate(
	workspace: Workspace,
	teammate: Teammate = teammateFactory.build(),
	otherTeammates: Teammate[] = [],
) {
	const teammates = [teammate, ...otherTeammates]

	mockGetUrls()
		.url(ApiPaths.WORKSPACE)
		.respond(workspace)
		.url(ApiPaths.CURRENT_TEAMMATE)
		.respond(teammate)
		.url(ApiPaths.ACTIVE_TEAMMATES)
		.respond(teammates)
		.url(ApiPaths.FEATURE_FLAGS_ENABLED)
		.respond([])
		.url(ApiPaths.CONVERSATIONS)
		.respond([])
		.url(ApiPaths.CONVERSATION_CHAT_HISTORY)
		.respond([])
		.apply()
}
