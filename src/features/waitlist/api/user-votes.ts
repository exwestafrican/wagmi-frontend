import { useQuery } from "@tanstack/react-query"
import type { AxiosResponse } from "axios"
import { ApiPaths } from "@/constants"
import { apiClient } from "@/lib/api-client"

export const USER_VOTES = "user-votes"

export interface UserVotesResponse {
	featureIds: string[] // Array of feature IDs the user has voted for
}

export function useUserVotes(email: string | null | undefined) {
	return useQuery<AxiosResponse<UserVotesResponse>>({
		queryKey: [USER_VOTES, email],
		queryFn: () => {
			return apiClient.get<UserVotesResponse>(ApiPaths.ROADMAP_USER_VOTES, {
				params: {
					email: email,
				},
			})
		},
		enabled: !!email, // Only fetch when email is provided
	})
}
