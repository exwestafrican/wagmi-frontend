import { useMutation } from "@tanstack/react-query"
import type { LoginData } from "@/features/auth/schema/loginSchema.ts"
import axios from "axios"
import { API_BASE_URL } from "@/constants.ts"

export function useLogin() {
	return useMutation({
		mutationFn: (data: LoginData) => {
			return axios.post(`${API_BASE_URL}/auth/magic-link/request`, data)
		},
	})
}
