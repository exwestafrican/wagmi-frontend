import { FahariAdminApiPaths } from "@fahari/constants.ts"
import type { OpenAccountData } from "@fahari/features/admin/accounts/schema.ts"
import { fahariAdminApiClient } from "@fahari/lib/fahari-admin-api-client.ts"
import { useMutation } from "@tanstack/react-query"

export function useOpenAccount() {
	return useMutation({
		mutationFn: (data: OpenAccountData) => {
			return fahariAdminApiClient.post(
				FahariAdminApiPaths.RESERVED_ACCOUNT,
				data,
			)
		},
	})
}
