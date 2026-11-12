import { StatusMessage } from "@fahari/features/booking/components/status-message.tsx"
import type { ErrorComponentProps } from "@tanstack/react-router"
import { HttpStatusCode, isAxiosError } from "axios"

export function BookingError({ error }: ErrorComponentProps) {
	const notFound =
		isAxiosError(error) && error.response?.status === HttpStatusCode.NotFound

	return (
		<StatusMessage>
			{notFound ? "No stay matches this code." : "Couldn't load this stay."}
		</StatusMessage>
	)
}
