import axios, { HttpStatusCode } from "axios"
import { API_BASE_URL } from "@/constants"
import { useAuthStore } from "@/stores/auth.store"
import { Pages } from "@/utils/pages"

export const apiClient = axios.create({
	baseURL: API_BASE_URL,
})

apiClient.interceptors.request.use((config) => {
	const token = useAuthStore.getState().token
	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}
	return config
})

apiClient.interceptors.response.use(
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
			window.location.href = `${Pages.LOGIN}?redirect=${redirectUrl}`
		}
		return Promise.reject(error)
	},
)
