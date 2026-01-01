import { ArrowUp, Diamond, Plus } from "lucide-react"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { FeatureRequestPriority } from "@/features/waitlist/enums/feature-request-priority"
import PriorityButton from "@/features/waitlist/components/priority-button"
import z from "zod"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useWaitlistStore } from "@/features/waitlist/store/useWaitlistStatus"
import { useSendFeatureRequest } from "@/features/waitlist/api/send-feature-request"
import { toast } from "sonner"
import { EmailRequestModal } from "@/features/waitlist/components/email-request-modal"
import featureRequestFormSchema from "@/features/waitlist/schema/feature-request-schema"
import { useState } from "react"

export function FeatureRequestModal({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const [openEmailRequestModal, onOpenEmailRequestModalChange] = useState(false)
	const email = useWaitlistStore((state) => state.email)
	const { mutate: sendFeatureRequest } = useSendFeatureRequest()
	const priorities = [
		{
			value: FeatureRequestPriority.LOW,
			label: "Low",
			icon: <Diamond className="w-4 h-4" />,
		},
		{
			value: FeatureRequestPriority.MEDIUM,
			label: "Medium",
			icon: <Diamond className="w-4 h-4" />,
		},
		{
			value: FeatureRequestPriority.HIGH,
			label: "High",
			icon: <Diamond className="w-4 h-4 fill-foreground" />,
		},
	]

	const form = useForm<z.infer<typeof featureRequestFormSchema>>({
		resolver: zodResolver(featureRequestFormSchema),
		mode: "onChange",
		defaultValues: {
			description: "",
			priority: FeatureRequestPriority.LOW,
		},
	})

	function requestUserEmail() {
		onOpenEmailRequestModalChange(true) //open email request modal
	}

	function submitFeatureRequest(
		values: z.infer<typeof featureRequestFormSchema> & { email: string },
	) {
		console.log(values, values.email)

		sendFeatureRequest(values, {
			onSuccess: () => {
				toast.success("Feature request sent successfully 🍾🍾")
				form.reset()
				onOpenChange(false)
			},
			onError: (error: unknown) => {
				toast.error("Uh oh! Something went wrong.", {
					description:
						"Failed to send feature request. Please try again later or contact support.",
				})
				console.error("Failed to send feature request", error)
			},
		})
	}

	return (
		<div>
			<Dialog
				open={open}
				onOpenChange={(open) => {
					if (open) {
						onOpenChange(true)
					} else {
						onOpenChange(false)
						form.reset()
					}
				}}
			>
				<Form {...form}>
					<DialogTrigger>
						<div
							data-testid="feature-request-button"
							className="text-foreground/40 hover:text-foreground/60 transition-colors transition-colors shadow-[0_0_15px_rgba(0,0,0,0.3)] rounded-full p-1 cursor-pointer"
						>
							<Plus className="w-5 h-5 " />
						</div>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Submit a request</DialogTitle>
						</DialogHeader>
						<DialogDescription
							data-testid="dialog-description"
							className="sr-only"
						>
							Share your feature idea with us. We'll review it and consider
							adding it to our roadmap.
						</DialogDescription>

						<form
							onSubmit={form.handleSubmit(() => {
								if (email) {
									submitFeatureRequest({ ...form.getValues(), email: email })
								} else {
									requestUserEmail()
								}
							})}
							className="space-y-4"
							data-testid="feature-request-form"
						>
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Textarea
												placeholder="Share your feature idea with us. We'll review it and consider adding it to our roadmap..."
												{...field}
												className="bg-muted/30 border-none min-h-[120px] resize-none"
												required
												autoFocus
												data-testid="feature-request-description"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="priority"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<div className="flex items-start gap-3 flex-col">
												<Label className="text-xs text-foreground/60">
													Priority
												</Label>
												<div className="flex gap-4  w-full justify-between items-center">
													{priorities.map((priority) => (
														<PriorityButton
															key={priority.value}
															isSelected={priority.value === field.value}
															onClick={() => field.onChange(priority.value)}
														>
															{priority.icon}
															{priority.label}
														</PriorityButton>
													))}
													<Button
														type="submit"
														disabled={!form.formState.isValid}
														size="icon"
														variant="outline"
														data-testid="feature-request-submit-button"
														className={`rounded-full hover:scale-105 transition duration-200 ease-out cursor-pointer  ${form.formState.isValid && "bg-black text-white hover:text-white hover:bg-black/90"} `}
													>
														<ArrowUp className="w-4 h-4" />
													</Button>
												</div>
											</div>
										</FormControl>
									</FormItem>
								)}
							/>
						</form>
					</DialogContent>
				</Form>
			</Dialog>
			<EmailRequestModal
				open={openEmailRequestModal}
				onOpenChange={onOpenEmailRequestModalChange}
				onSubmitEmailRequest={async (email: string) => {
					submitFeatureRequest({ ...form.getValues(), email: email })
					onOpenEmailRequestModalChange(false) //close email request modal
					onOpenChange(false) //close feature request modal
					form.reset() //reset form
				}}
			/>
		</div>
	)
}
