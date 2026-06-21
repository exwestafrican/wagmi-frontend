import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"

//TODO: take in message also for this. i.e text node.
export default function useSendNewMessage() {
	return useMutation({
		mutationFn: (data: {
			recipientTeammateId: number
			workspaceCode: string
		}) => {
			return apiClient.post(ApiPaths.SEND_NEW_MESSAGE, data)
		},
	})
}
