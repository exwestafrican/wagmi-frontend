import { differenceInCalendarDays, format } from "date-fns"

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

export function formatStaySummary(from: Date, to: Date) {
	const nights = differenceInCalendarDays(to, from)
	const nightLabel = nights === 1 ? "1 night" : `${nights} nights`
	const startLabel = format(from, "EEE d")
	const endLabel = format(to, "EEE d MMMM")

	return `${nightLabel} · ${startLabel} – ${endLabel}`
}
