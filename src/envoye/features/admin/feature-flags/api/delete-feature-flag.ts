import { useMutation, useQueryClient } from "@tanstack/react-query"
import { adminApiClient } from "@common/lib/admin-api-client.ts"
import { AdminApiPaths } from "@envoye/constants.ts"
import { FEATURE_FLAGS } from "@envoye/features/admin/feature-flags/api/list-feature-flags.ts"
import type { FeatureFlag } from "@envoye/features/admin/interface/feature-flag.ts"

export function useDeleteFeatureFlag() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (key: string) =>
			adminApiClient.post(AdminApiPaths.DELETE_FEATURE_FLAG, { key }),
		onMutate: async (key) => {
			const queryKey = [FEATURE_FLAGS] as const
			await queryClient.cancelQueries({ queryKey })
			const previous = queryClient.getQueryData<FeatureFlag[]>(queryKey)
			queryClient.setQueryData<FeatureFlag[]>(queryKey, (current) =>
				(current ?? []).filter((flag) => flag.key !== key),
			)
			return { previous, queryKey }
		},
		onError: (_error, _key, context) => {
			if (context?.previous) {
				queryClient.setQueryData(context.queryKey, context.previous)
			}
		},
		onSettled: () => {
			void queryClient.invalidateQueries({ queryKey: [FEATURE_FLAGS] })
		},
	})
}
