import type { UseQueryResult } from "@tanstack/react-query"
import { type AxiosError, HttpStatusCode } from "axios"
import { MIN_USERNAME_LENGTH } from "@/features/workspace/api/check-username.ts"

export default function usernameCheckMessage(
	query: UseQueryResult<null, AxiosError<unknown, Error>>,
	username: string,
) {
	if (username.length < MIN_USERNAME_LENGTH || !query.isError) return null

	const status = query.error?.response?.status
	if (status === HttpStatusCode.Conflict)
		return "username taken, lets get creative!!"
	if (status === HttpStatusCode.BadRequest)
		return 'Invalid username pattern. Try something with pattern "john.doe" or just "john"'
	return null
}
