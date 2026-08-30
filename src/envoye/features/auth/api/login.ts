import { useMutation } from "@tanstack/react-query"
import type { LoginData } from "@envoye/features/auth/schema/loginSchema.ts"
import { ApiPaths } from "@envoye/constants"
import { apiClient } from "@common/lib/api-client"

export function useLogin() {
	return useMutation({
		mutationFn: (data: LoginData) => {
			return apiClient.post(ApiPaths.MAGIC_LINK_REQUEST, data)
		},
	})
}
