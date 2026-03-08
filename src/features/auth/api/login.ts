import { useMutation } from "@tanstack/react-query"
import type { LoginData } from "@/features/auth/schema/loginSchema.ts"
import { ApiPaths } from "@/constants"
import { apiClient } from "@/lib/api-client"

export function useLogin() {
	return useMutation({
		mutationFn: (data: LoginData) => {
			return apiClient.post(ApiPaths.MAGIC_LINK_REQUEST, data)
		},
	})
}
