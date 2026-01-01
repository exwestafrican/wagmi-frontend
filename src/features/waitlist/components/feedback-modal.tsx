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

export function FeedbackModal({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
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

	const requestFormSchema = z.object({
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

	const form = useForm<z.infer<typeof requestFormSchema>>({
		resolver: zodResolver(requestFormSchema),
		mode: "onChange",
		defaultValues: {
			description: "",
			priority: FeatureRequestPriority.LOW,
		},
	})

	function onSubmit(values: z.infer<typeof requestFormSchema>) {
		console.log(values)
		form.reset()
		onOpenChange(false)
		//TODO: Send api call
	}

	return (
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
						Share your feature idea with us. We'll review it and consider adding
						it to our roadmap.
					</DialogDescription>

					<form
						onSubmit={form.handleSubmit(onSubmit)}
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
	)
}
