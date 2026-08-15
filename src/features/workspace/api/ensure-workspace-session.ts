import type { QueryClient } from "@tanstack/react-query"
import { currentTeammateQueryOptions } from "@/features/workspace/api/current-teammate.ts"
import { workspaceQueryOptions } from "@/features/workspace/api/workspace.ts"
import { featureFlagsQueryOptions } from "@/features/feature-flag/api/feature-flags.ts"
import {
	ConversationType,
	teammateConversationsQueryOptions,
} from "@/features/conversation/api/list-conversation.ts"
import { teammatesQueryOptions } from "@/features/directory/api/teammates.ts"

export async function ensureWorkspaceSession(
	queryClient: QueryClient,
	workspaceCode: string,
) {
	const [, teammate] = await Promise.all([
		queryClient.ensureQueryData(workspaceQueryOptions(workspaceCode)),
		queryClient.ensureQueryData(currentTeammateQueryOptions(workspaceCode)),
		queryClient.ensureQueryData(featureFlagsQueryOptions(workspaceCode)),
	])

	await Promise.all([
		queryClient.ensureQueryData(
			teammateConversationsQueryOptions(
				workspaceCode,
				teammate.id,
				ConversationType.PRIVATE,
			),
		),
		queryClient.ensureQueryData(
			teammateConversationsQueryOptions(
				workspaceCode,
				teammate.id,
				ConversationType.COLLABORATIVE,
			),
		),
		queryClient.ensureQueryData(teammatesQueryOptions(workspaceCode)),
	])
}
