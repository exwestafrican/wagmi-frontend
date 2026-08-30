import { useQuery } from "@tanstack/react-query"
import type { AxiosResponse } from "axios"
import { ApiPaths } from "@envoye/constants"
import { apiClient } from "@common/lib/api-client"
import type { RoadmapFeature } from "@envoye/features/waitlist/interfaces/roadmap-feature"

export const ROADMAP_FEATURES = "roadmap-features"

export function useGetRoadmapFeatures() {
	return useQuery<AxiosResponse<RoadmapFeature[]>>({
		queryKey: [ROADMAP_FEATURES],
		queryFn: () => apiClient.get(ApiPaths.ROADMAP_FUTURE_FEATURES),
	})
}
