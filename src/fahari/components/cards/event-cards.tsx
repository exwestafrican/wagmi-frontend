import { Progress } from "@common/components/ui/progress.tsx"
import { cn } from "@common/lib/utils.ts"
import { IconButton } from "@fahari/components/ui/button.tsx"
import {
	CountdownSticker,
	Pill,
	SoldOutBadge,
} from "@fahari/components/ui/pill.tsx"
import {
	CalendarIcon,
	CalendarPlus,
	ChevronRight,
	MapPin,
	Share2,
	Star,
} from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

// A photo, or the grey placeholder block when there is no photo yet.
function EventImage({
	src,
	alt = "",
	className,
	children,
}: {
	src?: string
	alt?: string
	className?: string
	children?: ReactNode
}) {
	return (
		<div
			className={cn(
				"relative shrink-0 overflow-hidden bg-fh-placeholder",
				className,
			)}
		>
			{src ? (
				<img src={src} alt={alt} className="size-full object-cover" />
			) : null}
			{children}
		</div>
	)
}

interface QuickActions {
	starred?: boolean
	onStar?: () => void
	onShare?: () => void
	onAddToCalendar?: () => void
}

// Star, share and add-to-calendar. Each button only shows when it has a handler.
function QuickActionButtons({
	starred,
	onStar,
	onShare,
	onAddToCalendar,
	variant,
	size,
	className,
}: QuickActions &
	Pick<ComponentProps<typeof IconButton>, "variant" | "size"> & {
		className?: string
	}) {
	return (
		<div className={cn("flex gap-2", className)}>
			{onStar ? (
				<IconButton
					variant={variant}
					size={size}
					aria-label={starred ? "Remove from interested" : "I'm interested"}
					aria-pressed={starred}
					onClick={onStar}
				>
					<Star aria-hidden className={cn(starred && "fill-current")} />
				</IconButton>
			) : null}
			{onShare ? (
				<IconButton
					variant={variant}
					size={size}
					aria-label="Share"
					onClick={onShare}
				>
					<Share2 aria-hidden />
				</IconButton>
			) : null}
			{onAddToCalendar ? (
				<IconButton
					variant={variant}
					size={size}
					aria-label="Add to calendar"
					onClick={onAddToCalendar}
				>
					<CalendarPlus aria-hidden />
				</IconButton>
			) : null}
		</div>
	)
}

// "from ₦40,000 · 48 interested"
function PriceLine({
	price,
	interested,
	priceClassName,
	interestedClassName,
}: {
	price: ReactNode
	interested?: ReactNode
	priceClassName: string
	interestedClassName: string
}) {
	return (
		<p className="flex flex-wrap items-baseline gap-x-1.5">
			<span className={cn("font-extrabold text-fh-ink", priceClassName)}>
				{price}
			</span>
			{interested ? (
				<span className={cn("text-fh-ink-muted", interestedClassName)}>
					· {interested}
				</span>
			) : null}
		</p>
	)
}

const cardShell =
	"rounded-fh-lg border border-fh-line bg-fh-surface shadow-fh-card"

const dashColor = "var(--fh-line-strong)"

// The big event card, styled like a ticket: photo on top, a perforated tear
// line, then the details.
export function EventCard({
	title,
	imageSrc,
	meta,
	hostName,
	hostAvatarSrc,
	price,
	interested,
	countdown,
	soldOut = false,
	className,
	...actions
}: QuickActions & {
	title: ReactNode
	imageSrc?: string
	// Date, time and place on one line.
	meta: ReactNode
	hostName?: ReactNode
	hostAvatarSrc?: string
	price: ReactNode
	interested?: ReactNode
	// Text for the tilted countdown sticker, e.g. "⏳ Closes in 14h 32m".
	countdown?: ReactNode
	soldOut?: boolean
	className?: string
}) {
	return (
		<article className={cn(cardShell, "relative flex flex-col", className)}>
			<div className="p-2 pb-0">
				<EventImage src={imageSrc} className="h-[220px] rounded-2xl">
					<QuickActionButtons
						{...actions}
						variant="onPhoto"
						size="sm"
						className="absolute top-3.5 right-3.5 [&_button]:shadow-none"
					/>
				</EventImage>
			</div>
			<div aria-hidden className="-mx-px flex h-6 items-center">
				<span className="relative h-6 w-3 overflow-hidden">
					<span className="absolute top-0 -left-3 size-6 rounded-full border border-fh-line bg-fh-page" />
				</span>
				<span
					className="mx-2.5 h-0.5 flex-1"
					style={{
						backgroundImage: `repeating-linear-gradient(90deg, ${dashColor} 0 10px, transparent 10px 20px)`,
					}}
				/>
				<span className="relative h-6 w-3 overflow-hidden">
					<span className="absolute top-0 left-0 size-6 rounded-full border border-fh-line bg-fh-page" />
				</span>
			</div>
			<div className="flex flex-col gap-1.5 px-5 pt-1 pb-[18px]">
				<h3 className="text-xl font-extrabold tracking-[-0.3px] text-fh-ink">
					{title}
				</h3>
				<p className="flex items-center gap-1.5 text-sm text-fh-ink-muted">
					<MapPin aria-hidden className="size-3.5 shrink-0" />
					<span>{meta}</span>
				</p>
				{hostName ? (
					<div className="flex items-center gap-2 text-[13px] font-semibold text-fh-ink">
						<EventImage
							src={hostAvatarSrc}
							className="size-[22px] rounded-full"
						/>
						<span>{hostName}</span>
					</div>
				) : null}
				<PriceLine
					price={price}
					interested={interested}
					priceClassName="text-[17px]"
					interestedClassName="text-sm"
				/>
			</div>
			{countdown ? (
				<CountdownSticker className="absolute top-[214px] left-5">
					{countdown}
				</CountdownSticker>
			) : null}
			{soldOut ? (
				<SoldOutBadge className="absolute top-[130px] -left-2.5" />
			) : null}
		</article>
	)
}

// Compact ticket for phone lists: photo on the left, tear line, details on the right.
export function EventRowCard({
	title,
	imageSrc,
	meta,
	price,
	interested,
	className,
	...actions
}: QuickActions & {
	title: ReactNode
	imageSrc?: string
	meta: ReactNode
	price: ReactNode
	interested?: ReactNode
	className?: string
}) {
	return (
		<article
			className={cn(
				cardShell,
				"flex h-[150px] overflow-hidden pr-3",
				className,
			)}
		>
			<EventImage src={imageSrc} className="w-28" />
			<div aria-hidden className="-my-px flex w-3.5 flex-col items-center">
				<span className="relative h-[7px] w-3.5 overflow-hidden">
					<span className="absolute -top-[7px] left-0 size-3.5 rounded-full border border-fh-line bg-fh-page" />
				</span>
				<span
					className="my-1.5 w-0.5 flex-1"
					style={{
						backgroundImage: `repeating-linear-gradient(180deg, ${dashColor} 0 5px, transparent 5px 14px)`,
					}}
				/>
				<span className="relative h-[7px] w-3.5 overflow-hidden">
					<span className="absolute top-0 left-0 size-3.5 rounded-full border border-fh-line bg-fh-page" />
				</span>
			</div>
			<div className="flex min-w-0 flex-1 flex-col justify-center gap-[5px] py-3 pl-2">
				<h3 className="truncate text-base font-extrabold text-fh-ink">
					{title}
				</h3>
				<p className="truncate text-[13px] text-fh-ink-muted">{meta}</p>
				<PriceLine
					price={price}
					interested={interested}
					priceClassName="text-[15px]"
					interestedClassName="text-xs"
				/>
				<QuickActionButtons
					{...actions}
					variant="outline"
					size="xs"
					className="pt-0.5"
				/>
			</div>
		</article>
	)
}

// Highlighted card for events closing soon: accent border, glow and a countdown.
export function LastChanceCard({
	title,
	imageSrc,
	meta,
	price,
	interested,
	countdown,
	starred,
	onStar,
	className,
}: Pick<QuickActions, "starred" | "onStar"> & {
	title: ReactNode
	imageSrc?: string
	meta: ReactNode
	price: ReactNode
	interested?: ReactNode
	countdown: ReactNode
	className?: string
}) {
	return (
		<article
			className={cn(
				"flex items-center gap-4 rounded-fh-lg border-2 border-fh-accent bg-fh-surface p-3 shadow-fh-glow",
				className,
			)}
		>
			<EventImage src={imageSrc} className="size-28 rounded-fh-md" />
			<div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
				<CountdownSticker tilted={false}>{countdown}</CountdownSticker>
				<h3 className="text-[19px] font-extrabold text-fh-ink">{title}</h3>
				<p className="text-sm text-fh-ink-muted">{meta}</p>
				<PriceLine
					price={price}
					interested={interested}
					priceClassName="text-base"
					interestedClassName="text-[13px]"
				/>
			</div>
			<QuickActionButtons starred={starred} onStar={onStar} />
		</article>
	)
}

// Smaller card for the "More like this" list under an event.
export function SimilarEventCard({
	title,
	imageSrc,
	meta,
	price,
	interested,
	starred,
	onStar,
	className,
}: Pick<QuickActions, "starred" | "onStar"> & {
	title: ReactNode
	imageSrc?: string
	meta: ReactNode
	price: ReactNode
	interested?: ReactNode
	className?: string
}) {
	return (
		<article className={cn(cardShell, "flex gap-3.5 p-3", className)}>
			<EventImage src={imageSrc} className="size-[140px] rounded-fh-md" />
			<div className="flex min-h-[140px] min-w-0 flex-1 flex-col justify-between">
				<div className="flex flex-col gap-1">
					<h3 className="text-[17px] font-extrabold text-fh-ink">{title}</h3>
					<p className="text-[13px] leading-[1.35] text-fh-ink-muted">{meta}</p>
					<p className="text-[15px] font-extrabold text-fh-ink">{price}</p>
				</div>
				<div className="flex items-center justify-between">
					<span className="text-xs text-fh-ink-muted">{interested}</span>
					<QuickActionButtons
						starred={starred}
						onStar={onStar}
						variant="outline"
						size="xs"
						className="[&_button]:size-[34px]"
					/>
				</div>
			</div>
		</article>
	)
}

// A host's own event in their dashboard: status, date, how full it is and money collected.
export function MyEventCard({
	title,
	imageSrc,
	active,
	date,
	booked,
	capacity,
	collected,
	className,
}: {
	title: ReactNode
	imageSrc?: string
	active: boolean
	date: ReactNode
	booked: number
	capacity: number
	// Already formatted, e.g. "₦540,000 collected".
	collected?: ReactNode
	className?: string
}) {
	const spotsLeft = Math.max(0, capacity - booked)
	const percentBooked = capacity > 0 ? (booked / capacity) * 100 : 0

	return (
		<article
			className={cn(cardShell, "flex items-center gap-4 p-3", className)}
		>
			<EventImage src={imageSrc} className="size-[88px] rounded-[14px]" />
			<div className="flex min-w-0 flex-1 flex-col gap-1.5">
				<div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
					<h3 className="text-lg font-extrabold text-fh-ink">{title}</h3>
					<Pill variant={active ? "active" : "deactivated"}>
						{active ? "Active" : "Deactivated"}
					</Pill>
				</div>
				<p className="flex items-center gap-1.5 text-sm text-fh-ink-muted">
					<CalendarIcon aria-hidden className="size-3.5 shrink-0" />
					<span>{date}</span>
				</p>
				<div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
					<p className="flex items-baseline gap-1">
						<span className="text-lg font-extrabold text-fh-ink">
							{booked} / {capacity}
						</span>
						<span className="text-sm text-fh-ink-muted">booked</span>
					</p>
					<Progress
						value={percentBooked}
						aria-label="Spots booked"
						className="h-1.5 w-40 rounded-[3px] bg-fh-subtle [&>[data-slot=progress-indicator]]:rounded-[3px] [&>[data-slot=progress-indicator]]:bg-fh-accent"
					/>
					<span className="text-sm text-fh-ink-muted">
						{spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
					</span>
				</div>
			</div>
			<div className="flex shrink-0 items-center gap-3 text-fh-ink-muted">
				{collected ? (
					<span className="hidden text-sm sm:inline">{collected}</span>
				) : null}
				<ChevronRight aria-hidden className="size-5" />
			</div>
		</article>
	)
}
