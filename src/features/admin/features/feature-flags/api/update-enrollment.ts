import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
	FEATURE_ENROLMENT,
	type FeatureEnrollment,
} from "@/features/admin/features/feature-flags/api/enrollment.ts"
import { adminApiClient } from "@/lib/admin-api-client.ts"
import { AdminApiPaths } from "@/constants.ts"

export default function useUpdateEnrollment() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async ({
			featureKey,
			enrollment,
		}: { featureKey: string; enrollment: FeatureEnrollment }) => {
			await adminApiClient.post(AdminApiPaths.ENABLE_FEATURE, {
				key: featureKey,
				appCodes: [enrollment.appCode],
			})
		},
		onMutate: async ({
			featureKey,
			enrollment,
		}: { featureKey: string; enrollment: FeatureEnrollment }) => {
			const queryKey = [FEATURE_ENROLMENT, featureKey] as const
			await queryClient.cancelQueries({ queryKey })
			const previous = queryClient.getQueryData<FeatureEnrollment[]>(queryKey)
			const newList = (previous ?? []).map((p) => {
				if (p.appId === enrollment.appId) {
					return {
						...p,
						hasFeature: enrollment.hasFeature,
					}
				}
				return p
			})
			queryClient.setQueryData(queryKey, newList) // ← update state in UI
			return { previous, queryKey }
		},
	})
}
