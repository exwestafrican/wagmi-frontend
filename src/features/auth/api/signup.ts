import { useMutation } from "@tanstack/react-query"
import { API_BASE_URL } from "@/constants.ts"
import axios from "axios"
import type { SignupData } from "@/features/auth/schema/signupSchema.ts"

export function useSignup() {
	return useMutation({
		mutationFn: (data: SignupData) => {
			return axios.post(`${API_BASE_URL}/auth/signup/email-only`, data)
		},
	})
}
