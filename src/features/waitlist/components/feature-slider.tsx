import type React from "react"
import { useState } from "react"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Bell, ArrowUp, Check } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { FeatureIcon } from "./feature-icon"
import { Status } from "./Status"
import type { RoadmapFeatureStage } from "../enums/roadmap-feautre-stage"

interface FeatureDetailSliderProps {
	icon: string
	title: string
	description: string
	status: RoadmapFeatureStage
	lastEdited: string
}

const FeatureDetailSlider: React.FC<FeatureDetailSliderProps> = ({
	icon,
	title,
	description,
	status,
	lastEdited,
}) => {
	const [isSubscribed, setIsSubscribed] = useState(false)
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button>Open</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<div className="p-2 bg-muted/30 rounded-lg w-fit">
						<FeatureIcon icon={icon} />
					</div>
					<SheetTitle className="font-normal text-lg mb-1">{title}</SheetTitle>
					<SheetDescription className="text-sm text-foreground/60">
						{description}
					</SheetDescription>
				</SheetHeader>
				<div className="px-4">
					<div className="flex items-center gap-2 mb-2">
						<Status stage={status} />
						<p className="text-sm text-foreground">Last edited: {lastEdited}</p>
					</div>
					<div className="relative">
						<Textarea
							placeholder="Leave feedback about this idea, your use-case and more..."
							className="min-h-[100px] bg-muted/30 border-border resize-none text-sm pr-12 pb-12"
						/>
						<Button
							variant={"outline"}
							className="absolute bottom-3 right-3 p-2 rounded-full border"
						>
							<ArrowUp className="w-4 h-4" />
						</Button>
					</div>
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

export default FeatureDetailSlider
