import { useQuery } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"

export const CHECK_USERNAME = "checkUsername"

export function useCheckUsername(username: string, workspaceCode: string) {
	return useQuery<null, AxiosError>({
		queryKey: [CHECK_USERNAME, workspaceCode, username],
		queryFn: () =>
			apiClient
				.get(ApiPaths.CHECK_USERNAME, {
					params: {
						username,
						workspaceCode,
					},
				})
				.then(() => null),
		enabled: username.length >= 2,
		retry: false,
		staleTime: 1000 * 30,
	})
}
