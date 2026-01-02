import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PriorityButtonProps {
	isSelected: boolean
	onClick: () => void
	children: React.ReactNode
}

export default function PriorityButton({
	isSelected,
	onClick,
	children,
}: PriorityButtonProps) {
	return (
		<Button
			type="button"
			variant="outline"
			onClick={onClick}
			className={cn(
				"flex-1 cursor-pointer gap-2",
				isSelected && "border-foreground bg-foreground/5",
			)}
			size="sm"
		>
			{children}
		</Button>
	)
}
