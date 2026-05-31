import { useQuery } from "@tanstack/react-query"
import { adminApiClient } from "@/lib/admin-api-client.ts"
import { AdminApiPaths } from "@/constants.ts"

export type FeatureEnrollment = {
	appId: string
	appCode: string
	name: string
	hasFeature: boolean
}

export const FEATURE_ENROLMENT = "feature-enrollment"

export default function useFeatureEnrollment(featureKey: string | undefined) {
	return useQuery<FeatureEnrollment[]>({
		queryKey: [FEATURE_ENROLMENT, featureKey] as const,
		queryFn: async () => {
			const res = await adminApiClient.get<FeatureEnrollment[]>(
				AdminApiPaths.FEATURE_ENROLLMENT,
				{ params: { featureKey } },
			)
			return res.data
		},
		staleTime: Number.POSITIVE_INFINITY,
		enabled: Boolean(featureKey),
	})
}
