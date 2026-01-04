import { API_BASE_URL } from "@/constants"
import { useQuery } from "@tanstack/react-query"
import axios, { type AxiosResponse } from "axios"

export const USER_VOTES = "user-votes"

export interface UserVotesResponse {
	featureIds: string[] // Array of feature IDs the user has voted for
}

export function useUserVotes(email: string | null | undefined) {
	return useQuery<AxiosResponse<UserVotesResponse>>({
		queryKey: [USER_VOTES, email],
		queryFn: () => {
			return axios.get<UserVotesResponse>(`${API_BASE_URL}/roadmap/user-votes`, {
				params: {
					email: email,
				},
			})
		},
		enabled: !!email, // Only fetch when email is provided
	})
}

