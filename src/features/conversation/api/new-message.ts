import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"
import type { AxiosResponse } from "axios"

type ConversationCreatedResponse = {
	id: number
}

//TODO: take in message also for this. i.e text node.
export default function useSendNewMessage() {
	return useMutation({
		mutationFn: (data: {
			recipientTeammateId: number
			workspaceCode: string
			openingMessage: string[]
			sentAt: number
		}): Promise<AxiosResponse<ConversationCreatedResponse>> => {
			const isoString = new Date(data.sentAt).toISOString()
			return apiClient.post(ApiPaths.SEND_NEW_MESSAGE, {
				...data,
				sentAt: isoString,
			})
		},
	})
}
