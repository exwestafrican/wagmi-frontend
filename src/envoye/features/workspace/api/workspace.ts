import type { Workspace } from "@envoye/features/workspace/interface/workspace.interface.ts"
import { queryOptions, useQuery } from "@tanstack/react-query"
import { ApiPaths } from "@envoye/constants"
import { apiClient } from "@common/lib/api-client"

export const WORKSPACE = "workspace"

export function workspaceQueryOptions(code: string) {
	return queryOptions({
		queryKey: [WORKSPACE, code],
		queryFn: () =>
			apiClient.get<Workspace>(ApiPaths.WORKSPACE, { params: { code } }),
		staleTime: Number.POSITIVE_INFINITY,
	})
}

export function useWorkspace(code: string) {
	return useQuery(workspaceQueryOptions(code))
}
