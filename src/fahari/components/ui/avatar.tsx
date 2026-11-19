import {
	AvatarFallback,
	AvatarGroupCount,
	AvatarImage,
	Avatar as ShadcnAvatar,
	AvatarGroup as ShadcnAvatarGroup,
} from "@common/components/ui/avatar.tsx"
import { cn } from "@common/lib/utils.ts"
import type { ComponentProps } from "react"

// The eight guest colours from the design system.
const colours = [
	"bg-fh-avatar-1",
	"bg-fh-avatar-2",
	"bg-fh-avatar-3",
	"bg-fh-avatar-4",
	"bg-fh-avatar-5",
	"bg-fh-avatar-6",
	"bg-fh-avatar-7",
	"bg-fh-avatar-8",
]

function initialsOf(name: string) {
	const words = name.trim().split(/\s+/).filter(Boolean)
	const letters =
		words.length > 1
			? `${words[0][0]}${words[words.length - 1][0]}`
			: (words[0] ?? "").slice(0, 2)
	return letters.toUpperCase()
}

// The same name always gets the same colour.
function colourFor(name: string) {
	let total = 0
	for (const character of name) total += character.charCodeAt(0)
	return colours[total % colours.length]
}

// A person's photo, or their initials on a pastel colour when there is none.
export function Avatar({
	name,
	src,
	className,
	...props
}: Omit<ComponentProps<typeof ShadcnAvatar>, "size"> & {
	name: string
	src?: string
}) {
	return (
		<ShadcnAvatar className={cn("size-10", className)} {...props}>
			{src ? (
				<AvatarImage src={src} alt={name} className="object-cover" />
			) : null}
			<AvatarFallback
				className={cn("text-sm font-bold text-fh-black", colourFor(name))}
			>
				{initialsOf(name)}
			</AvatarFallback>
		</ShadcnAvatar>
	)
}

// Overlapping avatars with a "+14" bubble for everyone who does not fit.
export function AvatarGroup({
	people,
	max = 5,
	className,
}: {
	people: { name: string; src?: string }[]
	max?: number
	className?: string
}) {
	const shown = people.slice(0, max)
	const extra = people.length - shown.length

	return (
		<ShadcnAvatarGroup className={cn("-space-x-3", className)}>
			{shown.map((person) => (
				<Avatar key={person.name} name={person.name} src={person.src} />
			))}
			{extra > 0 ? (
				<AvatarGroupCount className="size-10 bg-fh-subtle text-[13px] font-bold text-fh-ink">
					+{extra}
				</AvatarGroupCount>
			) : null}
		</ShadcnAvatarGroup>
	)
}
