import { useMutation } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client.ts"
import { AdminApiPaths } from "@/constants.ts"
import type { LoginData } from "@/features/auth/schema/loginSchema.ts"

export function useAdminLogin() {
	return useMutation({
		mutationFn: (data: LoginData) => {
			return apiClient.post(AdminApiPaths.LOGIN, data)
		},
	})
}
