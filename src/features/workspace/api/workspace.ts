import type { Workspace } from "@/features/workspace/interface/workspace.interface.ts"
import type { AxiosResponse } from "axios"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export const WORKSPACE = "workspace"

export function useWorkspace(code: string) {
	return useQuery<AxiosResponse<Workspace>>({
		queryKey: [WORKSPACE, code],
		queryFn: () => apiClient.get("/workspace", { params: { code } }),
		staleTime: Number.POSITIVE_INFINITY,
	})
}
