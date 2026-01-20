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
import { useTranslation } from "react-i18next"

interface ErrorResponse {
	message: string
	error: string
	statusCode: number
}

const JoinWaitListForm = () => {
	const { t } = useTranslation(["waitlist", "toast"])
	const formSchema = z.object({
		email: z
			.email({
				message: t("pleaseEnterAValidEmailAddress"),
			})
			.trim()
			.toLowerCase(),
	})

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
				toast.success(t("toast:waitlist.joinWaitListForm.success"))
				join(values.email) // update the store
			},
			onError: (error: unknown) => {
				const apiError = error as AxiosError<ErrorResponse>
				const errorResponse: ErrorResponse | undefined = apiError.response
					?.data as ErrorResponse | undefined
				if (errorResponse) {
					const errorMessage = errorResponse.message
						? errorResponse.message
						: t("toast:waitlist.joinWaitListForm.error.descriptionMain")
					toast.error(t("toast:somethingWentWrong"), {
						description: errorMessage,
					})
				} else {
					toast.error(t("toast:somethingWentWrong"), {
						description: t(
							"toast:waitlist.joinWaitListForm.error.descriptionFallback",
						),
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
										{isPending
											? t("joinForm.joining...")
											: t("joinForm.getNotified")}
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
