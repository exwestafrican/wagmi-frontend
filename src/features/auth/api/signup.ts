import { useMutation } from "@tanstack/react-query"
import type { SignupData } from "@/features/auth/schema/signupSchema.ts"
import { ApiPaths } from "@/constants"
import { apiClient } from "@/lib/api-client"

export function useSignup() {
	return useMutation({
		mutationFn: (data: SignupData) => {
			return apiClient.post(ApiPaths.SIGNUP_EMAIL_ONLY, data)
		},
	})
}
