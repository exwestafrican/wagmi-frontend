import type { Workspace } from "@/features/workspace/interface/workspace.interface.ts"
import axios, { type AxiosResponse } from "axios"
import { useQuery } from "@tanstack/react-query"
import { API_BASE_URL } from "@/constants.ts"

export const WORKSPACE = "workspace"

//TODO use local storage to load auth-token
export function useWorkspace({
	code,
	accessToken,
}: { code: string; accessToken: string }) {
	return useQuery<AxiosResponse<Workspace>>({
		queryKey: [WORKSPACE, code],
		queryFn: () =>
			axios.get(`${API_BASE_URL}/workspace`, {
				params: { code },
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			}),
	})
}
