import axios from "axios"
import { API_BASE_URL } from "@/constants"
import { useAuthStore } from "@/stores/auth.store"

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
