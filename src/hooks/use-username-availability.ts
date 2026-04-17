import type { UseFormReturn } from "react-hook-form"
import type { TeammateDetails } from "@/features/workspace/schema/teammate-details.ts"
import { useDebounce } from "@/hooks/use-debounce.ts"
import { useCheckUsername } from "@/features/workspace/api/check-username.ts"
import { useEffect } from "react"

export function useUsernameAvailability(
	form: UseFormReturn<TeammateDetails>,
	workspaceCode: string,
) {
	const username = form.watch("username")
	const debouncedUsername = useDebounce(username, 300)
	const { isFetching, isSuccess, isError, error } = useCheckUsername(
		debouncedUsername,
		workspaceCode,
	)

	useEffect(() => {
		if (username !== undefined) form.clearErrors("username")
	}, [username, form])

	useEffect(() => {
		if (isError && error?.response?.status === 409) {
			form.setError("username", { message: "Username is taken" })
		}
	}, [isError, error, form.setError])

	return {
		isFetching,
		isAvailable: isSuccess && debouncedUsername.length >= 2,
		showHint: !isError && !isSuccess && debouncedUsername.length < 2,
	}
}
