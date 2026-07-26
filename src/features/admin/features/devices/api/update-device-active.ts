import { useMutation, useQueryClient } from "@tanstack/react-query"
import { adminApiClient } from "@/lib/admin-api-client.ts"
import { AdminApiPaths } from "@/constants.ts"
import {
	TRACKER_DEVICES,
} from "@/features/admin/features/devices/api/list-devices.ts"
import type { Device } from "@/features/admin/features/devices/interface/device.ts"

export function useUpdateDeviceActive() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: async ({
			id,
			isActive,
		}: { id: string; isActive: boolean }) => {
			await adminApiClient.patch(`${AdminApiPaths.TRACKER_DEVICES}/${id}`, {
				isActive,
			})
		},
		onMutate: async ({ id, isActive }) => {
			const queryKey = [TRACKER_DEVICES] as const
			await queryClient.cancelQueries({ queryKey })
			const previous = queryClient.getQueryData<Device[]>(queryKey)
			queryClient.setQueryData<Device[]>(queryKey, (current) =>
				(current ?? []).map((device) =>
					device.id === id ? { ...device, isActive } : device,
				),
			)
			return { previous, queryKey }
		},
		onError: (_error, _vars, context) => {
			if (context?.previous) {
				queryClient.setQueryData(context.queryKey, context.previous)
			}
		},
	})
}
