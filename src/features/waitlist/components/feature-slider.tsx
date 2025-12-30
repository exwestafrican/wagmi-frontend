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

type FeatureStatus = "planned" | "in-progress" | "upcoming"

interface FeatureDetailSliderProps {
	icon: React.ReactNode
	title: string
	description: string
	status: FeatureStatus
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
					<div className="p-2 bg-muted/30 rounded-lg w-fit">{icon}</div>
					<SheetTitle className="font-normal text-lg mb-1">{title}</SheetTitle>
					<SheetDescription className="text-sm text-foreground/60">
						{description}
					</SheetDescription>
				</SheetHeader>
				<div className="px-4">
					<div className="flex items-center gap-2 mb-2">
						<div className="bg-green-500 w-2 h-2 rounded-full" />
						<p className="text-sm text-foreground">
							{status.charAt(0).toUpperCase() +
								status.slice(1).replace("-", " ")}{" "}
							Last edited: {lastEdited}
						</p>
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
