import { FahariAdminApiPaths } from "@fahari/constants.ts"
import { ACCOUNTS } from "@fahari/features/admin/accounts/api/list-accounts.ts"
import type { ProvisionAccountData } from "@fahari/features/admin/accounts/schema.ts"
import { fahariAdminApiClient } from "@fahari/lib/fahari-admin-api-client.ts"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export type ProvisionAccountPayload = ProvisionAccountData & {
	userId: number
}

export function useProvisionAccount() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (data: ProvisionAccountPayload) => {
			return fahariAdminApiClient.post(
				FahariAdminApiPaths.PROVISION_RESERVED_ACCOUNT,
				data,
			)
		},
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: [ACCOUNTS] })
		},
	})
}
