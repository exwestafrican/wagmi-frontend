import z from "zod"
import { FeatureRequestPriority } from "@/features/waitlist/enums/feature-request-priority"

const featureRequestFormSchema = z.object({
	description: z
		.string()
		.nonempty({
			message: "Description cannot be empty",
		})
		.max(5000, {
			message: "Description must be less than 5000 characters.",
		}),
	priority: z.enum(FeatureRequestPriority),
})

export default featureRequestFormSchema
