import { z } from "zod"

function wordCount(s: string): number {
	return s.trim().split(/\s+/).filter(Boolean).length
}

export const createFeatureFlagSchema = z.object({
	name: z.string().trim().min(1, { message: "Name is required" }),
	key: z.string().trim().min(1, { message: "Key is required" }),
	description: z
		.string()
		.trim()
		.min(1, { message: "Description is required" })
		.refine((s) => wordCount(s) <= 200, {
			message: "Description must be 200 words or fewer.",
		}),
})

export type CreateFeatureFlagFormValues = z.infer<
	typeof createFeatureFlagSchema
>
