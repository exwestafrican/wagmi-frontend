import { API_BASE_URL } from "@/lib/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"

export function usePostStatement() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (file: File) => {
			const formData = new FormData()
			formData.append("file", file)

			return axios.post(`${API_BASE_URL}/api/statement/save`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
				onUploadProgress: (progressEvent) => {
					const total = progressEvent.total || 0
					const percent = Math.round((progressEvent.loaded * 100) / total)
					console.log(percent)
				},
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["uploads"] })
		},
	})
}
