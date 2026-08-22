import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AdminApiPaths } from "@envoye/constants.ts"
import { adminApiClient } from "@common/lib/admin-api-client.ts"
import { TRACKER_DEVICES } from "@envoye/features/admin/devices/api/list-devices.ts"
import type { RegisterDeviceFormValues } from "@envoye/features/admin/devices/schema/register-device-schema.ts"

export function useCreateDevice() {
	const queryClient = useQueryClient()
	return useMutation({
		mutationFn: (payload: RegisterDeviceFormValues) =>
			adminApiClient.post(AdminApiPaths.TRACKER_DEVICES, {
				imei: payload.imei,
			}),
		onSuccess: () => {
			void queryClient.invalidateQueries({ queryKey: [TRACKER_DEVICES] })
		},
	})
}
