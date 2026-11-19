import { cn } from "@common/lib/utils.ts"
import type { ComponentProps } from "react"

// 18px ring: a faint full track with a 110 degree arc in the current text colour.
export function Spinner({ className, ...props }: ComponentProps<"svg">) {
	return (
		<svg
			viewBox="0 0 18 18"
			fill="none"
			className={cn("size-[18px] animate-spin", className)}
			{...props}
		>
			<title>Loading</title>
			<circle cx="9" cy="9" r="8" stroke="#8080804D" strokeWidth="2" />
			<circle
				cx="9"
				cy="9"
				r="8"
				stroke="currentColor"
				strokeWidth="2"
				strokeDasharray="15.36 50.27"
			/>
		</svg>
	)
}
