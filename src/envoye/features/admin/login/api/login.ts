import { useMutation } from "@tanstack/react-query"
import { adminApiClient } from "@common/lib/admin-api-client.ts"
import { AdminApiPaths } from "@envoye/constants.ts"
import type { LoginData } from "@envoye/features/auth/schema/loginSchema.ts"

export function useAdminLogin() {
	return useMutation({
		mutationFn: (data: LoginData) => {
			return adminApiClient.post(AdminApiPaths.LOGIN, data)
		},
	})
}
