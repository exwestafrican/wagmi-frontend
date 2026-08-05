import { useQuery } from "@tanstack/react-query"
import { ApiPaths } from "@/constants"
import { apiClient } from "@/lib/api-client"

export const PERMISSIONS = "permissions"

export function permissionQueryOptions(workspaceCode: string) {
	return {
		queryKey: [PERMISSIONS, workspaceCode],
		queryFn: async () => {
			const res = await apiClient.get<string[]>(ApiPaths.PERMISSIONS, {
				params: { workspaceCode },
			})
			return res.data
		},
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnWindowFocus: false,
	}
}

export function usePermission(workspaceCode: string) {
	return useQuery(permissionQueryOptions(workspaceCode))
}
