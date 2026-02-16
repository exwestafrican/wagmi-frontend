import { API_BASE_URL } from "@/constants"
import { useQuery } from "@tanstack/react-query"
import axios, { type AxiosResponse } from "axios"

export const ENABLED_FEATURES = "enabled-features"

export function useGetEnabledFeatures(workspaceCode: string) {
	return useQuery<AxiosResponse<string[]>>({
		queryKey: [ENABLED_FEATURES, workspaceCode],
		queryFn: () =>
			axios.get(
				`${API_BASE_URL}/feature-flags/enabled?workspaceCode=${workspaceCode}`,
			),
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnWindowFocus: false,
		enabled: !!workspaceCode,
	})
}
