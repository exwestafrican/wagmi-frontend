import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client.ts"
import { AdminApiPaths } from "@/constants.ts"
import { FEATURE_FLAGS } from "@/features/admin/features/feature-flags/api/list-feature-flags.ts"

export function useDeleteFeatureFlag() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (key: string) =>
			apiClient.post(AdminApiPaths.DELETE_FEATURE_FLAG, { key }),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: [FEATURE_FLAGS] })
		},
	})
}
