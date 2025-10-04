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
					console.info(percent)
				},
			})
		},
		onSuccess: (response) => {
			// Update the query cache with the new data
			queryClient.setQueryData(["uploads"], () => {
				const newFile = {
					id: response.data.id,
					name: response.data.name,
					size: response.data.size,
				}
				// Replace the entire array with the new file (overwrite behavior)
				return [newFile]
			})
		},
	})
}
