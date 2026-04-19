import { useQuery } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"

export const CHECK_USERNAME = "checkUsername"
export const MIN_USERNAME_LENGTH = 2

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
		enabled: username.length >= MIN_USERNAME_LENGTH,
		retry: false,
		staleTime: 1000 * 60,
	})
}
