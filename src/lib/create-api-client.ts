import axios, { type AxiosInstance, HttpStatusCode } from "axios"
import { API_BASE_URL } from "@/constants"
import { useAuthStore } from "@/stores/auth.store"

export function createApiClient(loginPath: string): AxiosInstance {
	const client = axios.create({
		baseURL: API_BASE_URL,
	})

	client.interceptors.request.use((config) => {
		const token = useAuthStore.getState().token
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	})

	client.interceptors.response.use(
		(response) => response,
		(error) => {
			const status = error.response?.status
			const hadAuthHeader = error.config?.headers?.Authorization

			// Only redirect when we thought we were authenticated (had token)
			// Avoid redirect on login/signup failures (no token = no redirect)
			if (
				(status === HttpStatusCode.Forbidden ||
					status === HttpStatusCode.Unauthorized) &&
				hadAuthHeader
			) {
				useAuthStore.getState().clearAuthToken()
				const redirectUrl = encodeURIComponent(window.location.href)
				window.location.href = `${loginPath}?redirect=${redirectUrl}`
			}
			return Promise.reject(error)
		},
	)

	return client
}
