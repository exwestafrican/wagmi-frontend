import { Toaster } from "@/components/ui/sonner"
import JoinWaitListForm from "@/features/waitlist/components/join-form"
import CountdownClock from "@/features/waitlist/components/countdown-clock.tsx"
import { useWaitlistStore } from "@/features/waitlist/store/useWaitlistStatus"
import { useGetRoadmapFeatures } from "@/features/waitlist/api/useRoadmapFeatures"
import {
	UpcomingFeature,
	UpcomingFeatureSkeleton,
} from "@/features/waitlist/components/upcoming-feature"
import {
	PlannedFeature,
	PlannedFeatureSkeleton,
} from "@/features/waitlist/components/planned-feature.tsx"
import { ArrowUp, Diamond, Loader, Plus } from "lucide-react"
import type { RoadmapFeature } from "@/features/waitlist/interfaces/roadmap-feature"
import { RoadmapFeatureStage } from "@/features/waitlist/enums/roadmap-feautre-stage"
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
import { useState } from "react"

function filterFeaturesByStage(
	features: RoadmapFeature[],
	stage: RoadmapFeatureStage,
) {
	return features.filter((feature: RoadmapFeature) => feature.stage === stage)
}

function WaitListPage() {
	const hasJoined = useWaitlistStore((state) => state.hasJoined)
	const emptyUpcomingFeatures = new Array(3)
		.fill(0)
		.map((_, idx) => ({ id: idx }))
	const { data: response, isLoading } = useGetRoadmapFeatures()
	const [isDialogOpen, setIsDialogOpen] = useState(false)

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
		setIsDialogOpen(false)
		//TODO: Send api call
	}

	return (
		<div
			className="min-h-screen px-8 flex items-center"
			style={{
				background:
					"radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 120, 120, 0.15), transparent 50%), #ffffff",
			}}
		>
			<Toaster richColors test-id="toaster" position="top-right" />
			<main className="mx-auto max-w-6xl  w-full flex flex-col lg:flex-row gap-10">
				<div className="flex-1 gap-8  flex flex-col justify-center">
					<div>
						<h2 className="text-4xl tracking-tight">
							Creating a remarkable customer experience
						</h2>
						<p className="text-foreground/60 tracking-tight">
							{" "}
							Unify all your customer communications in one powerful inbox.{" "}
						</p>
					</div>
					{hasJoined ? (
						<div>
							<p className=" text-sm  text-foreground/40 tracking-tight mb-2">
								Launching in
							</p>
							<CountdownClock />
						</div>
					) : (
						<JoinWaitListForm />
					)}
				</div>
				<div className="flex-1 order-2 space-y-12   lg:order-2">
					<div className="space-y-2">
						<div className="flex items-center gap-2">
							<Loader className="size-4 animate-spin" />
							<h2 className="tracking-wide text-sm"> work in progress</h2>
						</div>
						{isLoading ? (
							<PlannedFeatureSkeleton />
						) : (
							filterFeaturesByStage(
								response?.data ?? [],
								RoadmapFeatureStage.PLANNED,
							)
								.sort((a, b) => b.votes - a.votes)
								.map((feature) => (
									<PlannedFeature
										data-testid={`planned-feature-${feature.id}`}
										key={feature.id}
										feature={feature}
									/>
								))
						)}
					</div>

					<div className="space-y-2">
						<div className="flex justify-between items-center gap-2">
							<h2 className="tracking-wide text-sm"> upcoming features</h2>
							<Dialog
								open={isDialogOpen}
								onOpenChange={(open) => {
									if (open) {
										setIsDialogOpen(true)
									} else {
										setIsDialogOpen(false)
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
									<DialogContent aria-describedby="dialog-description">
										<form
											onSubmit={form.handleSubmit(onSubmit)}
											className="space-y-4"
											data-testid="feature-request-form"
										>
											<DialogHeader>
												<DialogTitle>Submit a request</DialogTitle>
												<DialogDescription
													data-testid="dialog-description"
													id="dialog-description"
													className="sr-only"
												>
													Share your feature idea with us. We'll review it and
													consider adding it to our roadmap.
												</DialogDescription>
											</DialogHeader>

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
																			isSelected={
																				priority.value === field.value
																			}
																			onClick={() =>
																				field.onChange(priority.value)
																			}
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
						</div>
						{isLoading
							? emptyUpcomingFeatures.map((emptyFeature) => (
									<UpcomingFeatureSkeleton key={emptyFeature.id} />
								))
							: filterFeaturesByStage(
									response?.data ?? [],
									RoadmapFeatureStage.IN_PROGRESS,
								)
									.sort((a, b) => b.votes - a.votes)
									.map((feature) => (
										<UpcomingFeature key={feature.id} feature={feature} />
									))}
					</div>
				</div>
			</main>
		</div>
	)
}

export default WaitListPage
