import type { ReactNode } from "react"
import { Separator } from "@/components/ui/separator.tsx"

export default function ConversationHeader({
	children,
}: { children: ReactNode }) {
	return (
		<div>
			<header className="px-4 pt-3 pb-2 flex gap-2 items-center">
				{children}
			</header>
			<Separator />
		</div>
	)
}
