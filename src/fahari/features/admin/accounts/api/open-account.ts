import { FahariAdminApiPaths } from "@fahari/constants.ts"
import { ACCOUNTS } from "@fahari/features/admin/accounts/api/list-accounts.ts"
import type { OpenAccountData } from "@fahari/features/admin/accounts/schema.ts"
import { fahariAdminApiClient } from "@fahari/lib/fahari-admin-api-client.ts"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useOpenAccount() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (data: OpenAccountData) => {
			return fahariAdminApiClient.post(
				FahariAdminApiPaths.RESERVED_ACCOUNT,
				data,
			)
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: [ACCOUNTS] })
		},
	})
}
