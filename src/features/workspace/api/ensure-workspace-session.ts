import type { QueryClient } from "@tanstack/react-query"
import { currentTeammateQueryOptions } from "@/features/workspace/api/current-teammate.ts"
import { workspaceQueryOptions } from "@/features/workspace/api/workspace.ts"
import { featureFlagsQueryOptions } from "@/features/feature-flag/api/feature-flags.ts"

export async function ensureWorkspaceSession(
	queryClient: QueryClient,
	workspaceCode: string,
) {
	await Promise.all([
		queryClient.ensureQueryData(workspaceQueryOptions(workspaceCode)),
		queryClient.ensureQueryData(currentTeammateQueryOptions(workspaceCode)),
		queryClient.ensureQueryData(featureFlagsQueryOptions(workspaceCode)),
	])
}
