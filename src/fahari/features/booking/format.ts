import { format } from "date-fns"

export function formatNightlyPrice(amount: number, currency: string) {
	return new Intl.NumberFormat("en-NG", {
		style: "currency",
		currency,
		currencyDisplay: "narrowSymbol",
		maximumFractionDigits: 0,
	}).format(amount)
}

export function formatStayDate(date: Date) {
	return format(date, "d MMM yyyy")
}
