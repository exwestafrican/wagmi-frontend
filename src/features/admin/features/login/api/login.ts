import { useMutation } from "@tanstack/react-query"
import { adminApiClient } from "@/lib/admin-api-client.ts"
import { AdminApiPaths } from "@/constants.ts"
import type { LoginData } from "@/features/auth/schema/loginSchema.ts"

export function useAdminLogin() {
	return useMutation({
		mutationFn: (data: LoginData) => {
			return adminApiClient.post(AdminApiPaths.LOGIN, data)
		},
	})
}
