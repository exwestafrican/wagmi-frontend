import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@common/components/ui/accordion.tsx"
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@common/components/ui/empty.tsx"
import { Skeleton } from "@common/components/ui/skeleton.tsx"
import { cn } from "@common/lib/utils.ts"
import { Avatar } from "@fahari/components/ui/avatar.tsx"
import { CircleAlert, SmilePlus } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

// A list of questions; each one is its own card that opens to show the answer.
export function Faq({
	items,
	className,
}: {
	items: { question: string; answer: ReactNode }[]
	className?: string
}) {
	return (
		<Accordion
			type="single"
			collapsible
			className={cn("flex flex-col gap-3", className)}
		>
			{items.map((item) => (
				<AccordionItem
					key={item.question}
					value={item.question}
					className="rounded-fh-lg border border-fh-line bg-fh-surface shadow-fh-card transition-colors last:border-b hover:bg-fh-subtle data-[state=open]:hover:bg-fh-surface"
				>
					<AccordionTrigger className="items-center gap-3 rounded-fh-lg px-5 py-[18px] text-base font-bold text-fh-ink hover:no-underline focus-visible:ring-2 focus-visible:ring-fh-accent-ink [&>svg]:size-[18px] [&>svg]:translate-y-0 [&>svg]:text-fh-ink-muted">
						{item.question}
					</AccordionTrigger>
					<AccordionContent className="px-5 pb-[18px] text-[15px] leading-[1.45] text-fh-ink-muted">
						{item.answer}
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	)
}

// One entry in an event's activity feed: either a comment (shown in a bubble)
// or a plain update line such as "updated their RSVP to Going".
export function ActivityItem({
	name,
	avatarSrc,
	meta,
	comment,
	update,
	reactions = [],
	onReact,
	onReply,
	className,
}: {
	name: string
	avatarSrc?: string
	// Small grey text after the name, e.g. "commented · 3d".
	meta?: ReactNode
	comment?: ReactNode
	update?: ReactNode
	reactions?: { emoji: string; count: number }[]
	onReact?: () => void
	onReply?: () => void
	className?: string
}) {
	return (
		<div className={cn("flex gap-3", className)}>
			<Avatar name={name} src={avatarSrc} />
			<div className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
				<p className="flex flex-wrap items-center gap-x-1.5 text-[15px]">
					<span className="font-bold text-fh-ink">{name}</span>
					{meta ? (
						<span className="text-sm text-fh-ink-muted">{meta}</span>
					) : null}
				</p>
				{comment ? (
					<p className="rounded-[18px] rounded-tl-[4px] bg-fh-subtle px-3.5 py-2.5 text-[15px] text-fh-ink">
						{comment}
					</p>
				) : null}
				{update ? (
					<p className="text-[15px] text-fh-ink-muted">{update}</p>
				) : null}
				<div className="flex items-center gap-2.5">
					{reactions.map((reaction) => (
						<span
							key={reaction.emoji}
							className="rounded-full bg-fh-subtle px-[9px] py-[3px] text-xs font-semibold text-fh-ink"
						>
							{reaction.emoji} {reaction.count}
						</span>
					))}
					{onReact ? (
						<button
							type="button"
							aria-label="Add reaction"
							onClick={onReact}
							className="flex size-7 items-center justify-center rounded-full border border-fh-line text-fh-ink-muted outline-none transition-colors hover:bg-fh-subtle focus-visible:ring-2 focus-visible:ring-fh-accent-ink"
						>
							<SmilePlus aria-hidden className="size-3.5" />
						</button>
					) : null}
					{onReply ? (
						<button
							type="button"
							onClick={onReply}
							className="rounded-fh-sm text-xs font-bold text-fh-ink-muted outline-none transition-colors hover:text-fh-ink focus-visible:ring-2 focus-visible:ring-fh-accent-ink"
						>
							Reply
						</button>
					) : null}
				</div>
			</div>
		</div>
	)
}

const skeletonShell =
	"rounded-fh-lg border border-fh-line bg-fh-surface p-3 [&_[data-slot=skeleton]]:bg-fh-subtle"

// Placeholder shown while an event card is loading.
export function SkeletonCard({ className }: { className?: string }) {
	return (
		<div
			aria-hidden
			className={cn(skeletonShell, "flex flex-col gap-3", className)}
		>
			<Skeleton className="h-40 w-full rounded-fh-md" />
			<Skeleton className="h-4 w-[70%] rounded-[6px]" />
			<Skeleton className="h-3 w-[85%] rounded-[6px]" />
			<Skeleton className="h-3 w-[45%] rounded-[6px]" />
		</div>
	)
}

// Placeholder shown while a list row is loading.
export function SkeletonRow({ className }: { className?: string }) {
	return (
		<div
			aria-hidden
			className={cn(skeletonShell, "flex items-center gap-3", className)}
		>
			<Skeleton className="size-16 shrink-0 rounded-fh-md" />
			<div className="flex flex-1 flex-col gap-2.5">
				<Skeleton className="h-3 w-[70%] rounded-[6px]" />
				<Skeleton className="h-3 w-[85%] rounded-[6px]" />
				<Skeleton className="h-3 w-[45%] rounded-[6px]" />
			</div>
		</div>
	)
}

function StateBlock({
	media,
	title,
	body,
	action,
	className,
	...props
}: Omit<ComponentProps<typeof Empty>, "title"> & {
	media: ReactNode
	title: ReactNode
	body?: ReactNode
	action?: ReactNode
}) {
	return (
		<Empty
			className={cn(
				"flex-none gap-3.5 rounded-fh-lg border border-solid border-fh-line bg-fh-surface p-8 md:p-8",
				className,
			)}
			{...props}
		>
			<EmptyHeader className="gap-3.5">
				<EmptyMedia className="mb-0">{media}</EmptyMedia>
				<EmptyTitle className="text-[22px] font-bold tracking-normal text-fh-ink">
					{title}
				</EmptyTitle>
				{body ? (
					<EmptyDescription className="text-[15px] leading-[1.45] text-fh-ink-muted">
						{body}
					</EmptyDescription>
				) : null}
			</EmptyHeader>
			{action ? <EmptyContent>{action}</EmptyContent> : null}
		</Empty>
	)
}

// "Nothing here yet" card: an icon, a title, a line of help and usually a button.
export function EmptyState({
	icon,
	...props
}: Omit<ComponentProps<typeof StateBlock>, "media"> & { icon: ReactNode }) {
	return (
		<StateBlock
			media={<span className="text-fh-accent-ink [&_svg]:size-12">{icon}</span>}
			{...props}
		/>
	)
}

// "Something went wrong" card with a red alert icon. Pass a retry button as `action`.
export function ErrorBlock({
	title = "Something went wrong",
	...props
}: Omit<ComponentProps<typeof StateBlock>, "media" | "title"> & {
	title?: ReactNode
}) {
	return (
		<StateBlock
			role="alert"
			media={
				<span className="flex size-14 items-center justify-center rounded-full bg-fh-subtle text-fh-error">
					<CircleAlert aria-hidden className="size-7" />
				</span>
			}
			title={title}
			{...props}
		/>
	)
}
