import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { API_BASE_URL } from "@/constants.ts"

export function useSetupWorkspace() {
	return useMutation({
		mutationFn: ({
			preverificationId,
			accessToken,
		}: { preverificationId: string; accessToken: string }) => {
			return axios.post(
				`${API_BASE_URL}/workspace/setup`,
				{ id: preverificationId },
				{
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				},
			)
		},
	})
}
