import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AdminApiPaths } from "@/constants.ts"
import { apiClient } from "@/lib/api-client.ts"
import { FEATURE_FLAGS } from "@/features/admin/features/feature-flags/api/list-feature-flags.ts"
import type { CreateFeatureFlagFormValues } from "@/features/admin/features/feature-flags/schema/create-feature-flag-schema.ts"

export function useCreateFeatureFlag() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (payload: CreateFeatureFlagFormValues) =>
			apiClient.post(AdminApiPaths.FEATURE_FLAGS, payload),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: [FEATURE_FLAGS] })
		},
	})
}
