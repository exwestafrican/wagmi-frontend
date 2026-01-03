import type React from "react"
import { useState } from "react"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Bell, ArrowUp, Check } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { FeatureIcon } from "./feature-icon"
import { Status } from "./Status"
import type { RoadmapFeature } from "../interfaces/roadmap-feature"
import { format } from "date-fns"
import sentenceCase from "@/utils/sentence-case"
import { useForm } from "react-hook-form"
import { featureFeedbackSchema } from "../schema/feature-feedback"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form"

interface FeatureDetailSliderProps {
	feature: RoadmapFeature | null
	open: boolean
	onOpenChange: (open: boolean) => void
}

const FeatureDetailSlider: React.FC<FeatureDetailSliderProps> = ({
	feature,
	open,
	onOpenChange,
}) => {
	const [isSubscribed, setIsSubscribed] = useState(false)

	const form = useForm<z.infer<typeof featureFeedbackSchema>>({
		resolver: zodResolver(featureFeedbackSchema),
		mode: "onChange",
		defaultValues: {
			feedback: "",
			// featureId: "",
		},
	})

	if (!feature) {
		return null
	}

	const submitFeedback = (values: z.infer<typeof featureFeedbackSchema>) => {
		console.log(values) // to be changed on endpoint integration
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent>
				<SheetHeader>
					<div className="p-2 bg-muted/30 rounded-lg w-fit">
						<FeatureIcon icon={feature.icon} />
					</div>
					<SheetTitle className="font-normal text-lg mb-1">
						{sentenceCase(feature.name)}
					</SheetTitle>
					<SheetDescription className="text-sm text-foreground/60">
						{feature.description}
					</SheetDescription>
				</SheetHeader>
				<div className="px-4">
					<div className="flex items-center gap-2 mb-2">
						<Status stage={feature.stage} />
						<p className="text-sm text-foreground">
							Last edited: {format(new Date(feature.updatedAt), "MMM dd, yyyy")}
						</p>
					</div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(submitFeedback)}>
							<FormField
								control={form.control}
								name="feedback"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<div className="relative">
												<Textarea
													placeholder="Leave feedback about this idea, your use-case and more..."
													{...field}
													className={`min-h-[120px] bg-muted/30 border resize-none text-sm pr-12 pb-12 ${
														fieldState.error
															? "border-red-300 focus-visible:ring-red-300"
															: "border-border"
													}`}
												/>
												<Button
													type="submit"
													variant={"outline"}
													className="absolute bottom-3 right-3 p-2 rounded-full border"
												>
													<ArrowUp className="w-4 h-4" />
												</Button>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</form>
					</Form>
					<Separator className="mt-4" />
				</div>
				<SheetFooter className="mt-0 pt-0">
					<p className="text-sm">Stay updated</p>
					<p className="text-sm text-foreground/60">
						Subscribe to get notified when this item is updated.
					</p>
					<Button
						onClick={() => setIsSubscribed(!isSubscribed)}
						className="w-fit flex items-center gap-2 px-3 py-1.5 bg-transparent border border-border rounded-lg hover:bg-foreground/5 transition-colors text-sm"
					>
						{isSubscribed ? (
							<Check className="w-4 h-4 text-foreground/60" />
						) : (
							<Bell className="w-4 h-4 text-foreground/60" />
						)}
						<span className="text-foreground">
							{isSubscribed ? "Subscribed" : "Subscribe"}
						</span>
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}

export function FeatureDetailSliderSkeleton() {
	return (
		<Sheet open={true}>
			<SheetContent>
				<SheetHeader>
					<div className="p-2 bg-muted/30 rounded-lg w-fit animate-pulse">
						<div className="w-6 h-6 bg-muted rounded" />
					</div>
					<div className="space-y-2">
						<div className="h-6 w-3/4 bg-muted rounded animate-pulse" />
						<div className="h-4 w-full bg-muted rounded animate-pulse" />
						<div className="h-4 w-5/6 bg-muted rounded animate-pulse" />
					</div>
				</SheetHeader>
				<div className="px-4">
					<div className="flex items-center gap-2 mb-2 animate-pulse">
						<div className="w-2 h-2 rounded-full bg-muted" />
						<div className="h-4 w-48 bg-muted rounded" />
					</div>
					<div className="relative">
						<div className="h-[100px] bg-muted/30 rounded-lg animate-pulse" />
					</div>
					<Separator className="mt-4" />
				</div>
				<SheetFooter className="mt-0 pt-0">
					<div className="space-y-2 w-full">
						<div className="h-4 w-24 bg-muted rounded animate-pulse" />
						<div className="h-4 w-full bg-muted rounded animate-pulse" />
						<div className="h-9 w-28 bg-muted rounded-lg animate-pulse" />
					</div>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}

export default FeatureDetailSlider
