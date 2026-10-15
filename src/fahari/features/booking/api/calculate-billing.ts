import { apiClient } from "@common/lib/api-client.ts"
import { FahariApiPaths } from "@fahari/constants.ts"
import { queryOptions, useQuery } from "@tanstack/react-query"

export const FAHARI_BILLING = "fahari-billing"

export type LineItem = "accommodation" | "ride"

type BillingAmount = {
	amount: number
}

export function billingQueryOptions(
	resortCode: string,
	numberOfNights: number,
	lineItem: LineItem,
	numberOfGuests: number,
) {
	return queryOptions({
		queryKey: [
			FAHARI_BILLING,
			resortCode,
			numberOfNights,
			lineItem,
			numberOfGuests,
		],
		queryFn: async () => {
			const res = await apiClient.get<BillingAmount>(FahariApiPaths.CALCULATE, {
				params: {
					resortCode,
					numberOfNights,
					lineItem,
					numberOfGuests,
				},
			})
			return res.data
		},
	})
}

export function useBilling(
	resortCode: string,
	numberOfNights: number,
	lineItem: LineItem,
	numberOfGuests: number,
	enabled: boolean,
) {
	return useQuery({
		...billingQueryOptions(
			resortCode,
			numberOfNights,
			lineItem,
			numberOfGuests,
		),
		enabled,
	})
}
