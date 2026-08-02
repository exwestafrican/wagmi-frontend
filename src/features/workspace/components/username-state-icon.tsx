import type { UseQueryResult } from "@tanstack/react-query"
import { type AxiosError, HttpStatusCode } from "axios"
import { CircleCheckBig, CircleX, Loader2 } from "lucide-react"

export default function UsernameStateIcon({
	query,
}: {
	query: UseQueryResult<null, AxiosError<unknown, Error>>
}) {
	const icon = () => {
		if (query.isSuccess) {
			return (
				<CircleCheckBig
					data-testid="username-available"
					className="size-4 text-green-600"
				/>
			)
		}
		if (
			query.isError &&
			(query.error?.response?.status === HttpStatusCode.Conflict ||
				query.error?.response?.status === HttpStatusCode.BadRequest)
		) {
			return (
				<CircleX
					data-testid="username-error"
					className="size-4 text-destructive"
				/>
			)
		}
		return (
			<Loader2
				data-testid="username-checking"
				className="size-4 animate-spin text-neutral-400"
			/>
		)
	}
	return icon()
}
