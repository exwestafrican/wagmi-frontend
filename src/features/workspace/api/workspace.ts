import type { Workspace } from "@/features/workspace/interface/workspace.interface.ts"
import axios, { type AxiosResponse } from "axios"
import { useQuery } from "@tanstack/react-query"
import { API_BASE_URL } from "@/constants.ts"
import { useAuthStore } from "@/stores/auth.store.ts"

export const WORKSPACE = "workspace"

export function useWorkspace(code: string) {
	const token = useAuthStore((store) => store.token)
	return useQuery<AxiosResponse<Workspace>>({
		queryKey: [WORKSPACE, code],
		queryFn: () =>
			axios.get(`${API_BASE_URL}/workspace`, {
				params: { code },
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}),
		staleTime: Number.POSITIVE_INFINITY,
	})
}
