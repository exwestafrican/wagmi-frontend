import { useQuery } from "@tanstack/react-query"
import type { Device } from "@envoye/features/admin/devices/interface/device.ts"
import { adminApiClient } from "@common/lib/admin-api-client.ts"
import { AdminApiPaths } from "@envoye/constants.ts"

export const TRACKER_DEVICES = "tracker-devices"

export function useDevices() {
	return useQuery<Device[]>({
		queryKey: [TRACKER_DEVICES],
		staleTime: Number.POSITIVE_INFINITY,
		queryFn: async () => {
			const res = await adminApiClient.get<Device[]>(
				AdminApiPaths.TRACKER_DEVICES,
			)
			return res.data
		},
	})
}
