import { apiClient } from "@common/lib/api-client.ts"
import { FahariApiPaths } from "@fahari/constants.ts"
import { queryOptions, useQuery } from "@tanstack/react-query"

export const FAHARI_BILLING = "fahari-billing"

type BillingAmount = {
	amount: string
}

export function billingQueryOptions(
	clientCode: string,
	pickupDateTime: string,
	returnDateTime?: string,
) {
	return queryOptions({
		queryKey: [
			FAHARI_BILLING,
			clientCode,
			pickupDateTime,
			...(returnDateTime ? [returnDateTime] : []),
		],
		queryFn: async () => {
			const res = await apiClient.get<BillingAmount>(FahariApiPaths.RIDE_FARE, {
				params: {
					clientCode,
					pickupDateTime,
					...(returnDateTime ? { returnDateTime } : {}),
				},
			})
			return res.data
		},
	})
}

export function useBilling(
	clientCode: string,
	pickupDateTime: string,
	returnDateTime: string | undefined,
	enabled: boolean,
) {
	return useQuery({
		...billingQueryOptions(clientCode, pickupDateTime, returnDateTime),
		enabled,
	})
}
