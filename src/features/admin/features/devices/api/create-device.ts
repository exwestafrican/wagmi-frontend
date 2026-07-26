import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AdminApiPaths } from "@/constants.ts"
import { adminApiClient } from "@/lib/admin-api-client.ts"
import { TRACKER_DEVICES } from "@/features/admin/features/devices/api/list-devices.ts"
import type { RegisterDeviceFormValues } from "@/features/admin/features/devices/schema/register-device-schema.ts"

export function useCreateDevice() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (payload: RegisterDeviceFormValues) =>
			adminApiClient.post(AdminApiPaths.TRACKER_DEVICES, {
				imei: payload.imei,
				isActive: false,
			}),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: [TRACKER_DEVICES] })
		},
	})
}
