import z from "zod"

export const featureFeedbackSchema = z.object({
	feedback: z
		.string()
		.nonempty({
			message: "Please provide your feedback",
		})
		.max(5000, {
			message: "Feedback must be less than 5000 characters.",
		}),
	featureId: z.string(),
})
