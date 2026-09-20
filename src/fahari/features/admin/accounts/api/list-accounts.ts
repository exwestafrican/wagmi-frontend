import { FahariAdminApiPaths } from "@fahari/constants.ts"
import { fahariAdminApiClient } from "@fahari/lib/fahari-admin-api-client.ts"
import { useQuery } from "@tanstack/react-query"

export const ACCOUNTS = "fahari-accounts"

export type DriverAccount = {
	userId: number
	firstName: string
	lastName: string
	email: string
	reservedAccountId: number | null
	accountNumber: string | null
}

export function useAccounts() {
	return useQuery({
		queryKey: [ACCOUNTS],
		queryFn: async () => {
			const res = await fahariAdminApiClient.get<DriverAccount[]>(
				FahariAdminApiPaths.USERS,
			)
			return res.data
		},
	})
}
