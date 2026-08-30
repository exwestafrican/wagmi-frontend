import { useMutation } from "@tanstack/react-query"
import type { SignupData } from "@envoye/features/auth/schema/signupSchema.ts"
import { ApiPaths } from "@envoye/constants"
import { apiClient } from "@common/lib/api-client"

export function useSignup() {
	return useMutation({
		mutationFn: (data: SignupData) => {
			return apiClient.post(ApiPaths.SIGNUP_EMAIL_ONLY, data)
		},
	})
}
