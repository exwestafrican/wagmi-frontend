import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"

const VERIFY_INVITE = "verify-invite"

interface DecodedInvite {
	email: string
	workspace: string
}

export function useVerifyInvite(inviteCode: string) {
	return useQuery<DecodedInvite>({
		queryKey: [VERIFY_INVITE, inviteCode],
		queryFn: async () => {
			const res = await apiClient.get(ApiPaths.VERIFY_INVITE, {
				params: { inviteCode },
			})
			return {
				email: res.data.recipientEmail,
				workspace: res.data.workspace,
			}
		},
		staleTime: Number.POSITIVE_INFINITY,
		refetchOnWindowFocus: false,
		enabled: Boolean(inviteCode),
	})
}
