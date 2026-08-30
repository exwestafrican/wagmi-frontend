import { z } from "zod"

export const registerDeviceSchema = z.object({
	imei: z.string().trim().min(1, { message: "IMEI is required" }),
})

export type RegisterDeviceFormValues = z.infer<typeof registerDeviceSchema>
