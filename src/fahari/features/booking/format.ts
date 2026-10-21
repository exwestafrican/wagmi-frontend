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

export function formatDateTime(
	day: number,
	month: number,
	year: number,
	hour: number,
	minute: number,
) {
	return new Date(year, month - 1, day, hour, minute).toISOString()
}

export function formatRideDateTime(date: Date, time: string) {
	const [hourText, minuteText] = time.trim().split(":")
	const hour = Number(hourText)
	const minute = Number(minuteText)
	if (
		!hourText ||
		minuteText === undefined ||
		minuteText === "" ||
		Number.isNaN(hour) ||
		Number.isNaN(minute)
	) {
		return undefined
	}
	return formatDateTime(
		date.getDate(),
		date.getMonth() + 1,
		date.getFullYear(),
		hour,
		minute,
	)
}
