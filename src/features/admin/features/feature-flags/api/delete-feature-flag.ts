import { useMutation, useQueryClient } from "@tanstack/react-query"
import { adminApiClient } from "@/lib/admin-api-client.ts"
import { AdminApiPaths } from "@/constants.ts"
import { FEATURE_FLAGS } from "@/features/admin/features/feature-flags/api/list-feature-flags.ts"

export function useDeleteFeatureFlag() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (key: string) =>
			adminApiClient.post(AdminApiPaths.DELETE_FEATURE_FLAG, { key }),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: [FEATURE_FLAGS] })
		},
	})
}
