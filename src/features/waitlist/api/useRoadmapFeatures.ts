import { API_BASE_URL } from "@/constants"
import { useQuery } from "@tanstack/react-query"
import axios, { type AxiosResponse } from "axios"
import type { RoadmapFeature } from "@/features/waitlist/interfaces/roadmap-feature"

export const ROADMAP_FEATURES = "roadmap-features"

export function useGetRoadmapFeatures() {
	return useQuery<AxiosResponse<RoadmapFeature[]>>({
		queryKey: [ROADMAP_FEATURES],
		queryFn: () => axios.get(`${API_BASE_URL}/roadmap/future-features`),
	})
}
