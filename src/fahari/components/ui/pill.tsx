import { Badge } from "@common/components/ui/badge.tsx"
import { cn } from "@common/lib/utils.ts"
import { type VariantProps, cva } from "class-variance-authority"
import { Instagram } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

const pillVariants = cva("gap-1.5 px-[9px] py-[3px] text-xs font-bold", {
	variants: {
		variant: {
			active: "bg-fh-accent text-fh-on-accent",
			deactivated: "border-fh-line-strong bg-transparent text-fh-ink-muted",
			// Neutral pill with a leading dot, e.g. "2 spots left".
			status: "bg-fh-subtle text-fh-ink",
			// Sits on a photo, so it keeps the same colours in both modes.
			ended: "bg-[#121212b3] py-[2px] text-white",
		},
	},
	defaultVariants: {
		variant: "active",
	},
})

export function Pill({
	className,
	variant = "active",
	children,
	...props
}: Omit<ComponentProps<typeof Badge>, "variant"> &
	VariantProps<typeof pillVariants>) {
	return (
		<Badge className={cn(pillVariants({ variant }), className)} {...props}>
			{variant === "status" ? (
				<span
					aria-hidden
					className="size-1.5 shrink-0 rounded-full bg-fh-accent-ink"
				/>
			) : null}
			{children}
		</Badge>
	)
}

// Dark countdown label, tilted like a sticker unless `tilted` is turned off.
export function CountdownSticker({
	className,
	tilted = true,
	...props
}: ComponentProps<typeof Badge> & { tilted?: boolean }) {
	return (
		<Badge
			className={cn(
				"bg-[#121212] px-[11px] py-1 text-xs font-bold text-[#aae1f0]",
				tilted && "-rotate-[4deg]",
				className,
			)}
			{...props}
		/>
	)
}

// Round "Sold out" stamp that overlaps the corner of an event photo.
export function SoldOutBadge({
	className,
	children = "Sold out",
	...props
}: ComponentProps<"span">) {
	return (
		<span
			className={cn(
				"flex size-24 -rotate-[8deg] items-center justify-center rounded-full bg-[#121212] px-4 text-center text-xl leading-[1.05] font-extrabold text-[#f7f7f4] shadow-[0_4px_12px_#00000066]",
				className,
			)}
			{...props}
		>
			{children}
		</span>
	)
}

const sources = {
	instagram: {
		label: "via Instagram",
		icon: <Instagram aria-hidden className="size-3" />,
	},
	fahari: {
		label: "On Fahari",
		icon: (
			<span
				aria-hidden
				className="flex size-3 items-center justify-center rounded-[3px] bg-[#121212] text-[8px] font-extrabold text-white"
			>
				F
			</span>
		),
	},
} satisfies Record<string, { label: string; icon: ReactNode }>

// Says where an event listing came from. White in both modes: it sits on photos.
export function SourcePill({
	source,
	className,
	...props
}: Omit<ComponentProps<typeof Badge>, "children"> & {
	source: keyof typeof sources
}) {
	return (
		<Badge
			className={cn(
				"gap-1.5 bg-white px-[11px] py-[5px] text-[13px] font-semibold text-[#121212] shadow-fh-float",
				className,
			)}
			{...props}
		>
			{sources[source].icon}
			{sources[source].label}
		</Badge>
	)
}
