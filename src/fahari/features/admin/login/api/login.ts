import { useMutation } from "@tanstack/react-query"
import { FahariAdminApiPaths } from "@fahari/constants.ts"
import type { LoginData } from "@fahari/features/admin/login/schema.ts"
import { fahariAdminApiClient } from "@fahari/lib/fahari-admin-api-client.ts"

export function useFahariAdminLogin() {
	return useMutation({
		mutationFn: (data: LoginData) => {
			return fahariAdminApiClient.post(FahariAdminApiPaths.LOGIN, data)
		},
	})
}
