import { useMutation } from "@tanstack/react-query"
import type { LoginData } from "@/features/auth/schema/loginSchema.ts"
import { apiClient } from "@/lib/api-client"

export function useLogin() {
	return useMutation({
		mutationFn: (data: LoginData) => {
			return apiClient.post("/auth/magic-link/request", data)
		},
	})
}
