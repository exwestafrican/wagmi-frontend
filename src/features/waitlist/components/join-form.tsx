import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useJoinWaitList } from "@/features/waitlist/api/join-waitlist"
import { toast } from "sonner"
import { useWaitlistStore } from "@/features/waitlist/store/useWaitlistStatus"
import type { AxiosError } from "axios"

const formSchema = z.object({
	email: z
		.email({
			message: "Please enter a valid email address.",
		})
		.trim()
		.toLowerCase(),
})

interface ErrorResponse {
	message: string
	error: string
	statusCode: number
}

const JoinWaitListForm = () => {
	const { mutate: joinWaitList, isPending } = useJoinWaitList()
	const join = useWaitlistStore((state) => state.join)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { email: "" },
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		joinWaitList(values.email, {
			onSuccess: () => {
				form.reset()
				join(values.email) // update the store
				toast.success("Congratulations!!! You are on the wait list! 🍾🍾")
			},
			onError: (error: unknown) => {
				const apiError = error as AxiosError<ErrorResponse>
				const errorResponse: ErrorResponse | undefined = apiError.response
					?.data as ErrorResponse | undefined
				if (errorResponse) {
					const errorMessage = errorResponse.message
						? errorResponse.message
						: "Failed to join wait list"
					toast.error("Uh oh! Something went wrong.", {
						description: errorMessage,
					})
				} else {
					toast.error("Uh oh! Something went wrong.", {
						description:
							"We could not add you to the wait list at this time. Please try again later.",
					})
				}
			},
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="flex items-center gap-3 border-b border-border pb-3">
									<Input
										data-testid="waitlist-email-input"
										className="bg-transparent border-0 shadow-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0  placeholder:text-foreground/40"
										placeholder="Enter your email..."
										{...field}
									/>
									<Button
										data-testid="join-button"
										className="cursor-pointer bg-black text-white hover:bg-black/90"
										type="submit"
										disabled={isPending}
									>
										{isPending ? "Joining..." : "Get Notified"}
									</Button>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}

export default JoinWaitListForm
