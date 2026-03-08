import { useMutation } from "@tanstack/react-query"
import type { SignupData } from "@/features/auth/schema/signupSchema.ts"
import { apiClient } from "@/lib/api-client"

export function useSignup() {
	return useMutation({
		mutationFn: (data: SignupData) => {
			return apiClient.post("/auth/signup/email-only", data)
		},
	})
}
