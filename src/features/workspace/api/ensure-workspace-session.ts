import type { QueryClient } from "@tanstack/react-query"
import { currentTeammateQueryOptions } from "@/features/workspace/api/current-teammate.ts"
import { workspaceQueryOptions } from "@/features/workspace/api/workspace.ts"
import { featureFlagsQueryOptions } from "@/features/feature-flag/api/feature-flags.ts"
import {
	ConversationType,
	teammateConversationsQueryOptions,
} from "@/features/conversation/api/list-conversation.ts"
import { teammatesQueryOptions } from "@/features/directory/api/teammates.ts"

function loadWorkspace(queryClient: QueryClient, workspaceCode: string) {
	return queryClient.ensureQueryData(workspaceQueryOptions(workspaceCode))
}

function loadCurrentTeammate(
	queryClient: QueryClient,
	workspaceCode: string,
) {
	return queryClient.ensureQueryData(
		currentTeammateQueryOptions(workspaceCode),
	)
}

function loadFeatureFlags(queryClient: QueryClient, workspaceCode: string) {
	return queryClient.ensureQueryData(featureFlagsQueryOptions(workspaceCode))
}

function loadConversations(
	queryClient: QueryClient,
	workspaceCode: string,
	teammateId: number,
) {
	return Promise.all([
		queryClient.ensureQueryData(
			teammateConversationsQueryOptions(
				workspaceCode,
				teammateId,
				ConversationType.PRIVATE,
			),
		),
		queryClient.ensureQueryData(
			teammateConversationsQueryOptions(
				workspaceCode,
				teammateId,
				ConversationType.COLLABORATIVE,
			),
		),
	])
}

function loadActiveTeammates(
	queryClient: QueryClient,
	workspaceCode: string,
) {
	return queryClient.ensureQueryData(teammatesQueryOptions(workspaceCode))
}

export async function ensureWorkspaceSession(
	queryClient: QueryClient,
	workspaceCode: string,
) {
	const [, teammate] = await Promise.all([
		loadWorkspace(queryClient, workspaceCode),
		loadCurrentTeammate(queryClient, workspaceCode),
		loadFeatureFlags(queryClient, workspaceCode),
	])

	await Promise.all([
		loadConversations(queryClient, workspaceCode, teammate.id),
		loadActiveTeammates(queryClient, workspaceCode),
	])
}
