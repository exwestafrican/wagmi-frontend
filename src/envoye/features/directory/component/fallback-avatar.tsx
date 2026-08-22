import type { Teammate } from "@envoye/features/workspace/interface/teammate.interface.ts"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@common/lib/utils.ts"
import { Skeleton } from "@common/components/ui/skeleton.tsx"

const fallbackAvatarVariants = cva(
	"rounded-md  text-base font-semibold flex items-center justify-center w-fit",
	{
		variants: {
			size: {
				xxs: "min-w-4 min-h-4 text-xs rounded-sm font-semibold shrink-0",
				xs: "min-w-6 min-h-6 text-xs",
				sm: "min-w-8 min-h-8 text-sm",
				m: "min-w-10 min-h-10 text-base ",
			},
			variant: {
				outline: "border-2 border-solid",
				stone: "bg-stone-200 text-stone-800",
				none: "",
			},
		},
		defaultVariants: {
			size: "m",
			variant: "outline",
		},
	},
)

type Props = {
	teammate: Teammate
} & VariantProps<typeof fallbackAvatarVariants>
export default function FallbackAvatar({
	teammate,
	size = "m",
	variant = "outline",
}: Props) {
	return (
		<div className={cn(fallbackAvatarVariants({ size, variant }))}>
			{" "}
			{teammate.firstName.charAt(0).toUpperCase()}
		</div>
	)
}

type FakeAvatarProps = {
	displayCharacter: string
} & VariantProps<typeof fallbackAvatarVariants>

export function FakeAvatar({
	displayCharacter,
	size = "m",
	variant = "outline",
}: FakeAvatarProps) {
	return (
		<div className={cn(fallbackAvatarVariants({ size, variant }))}>
			{" "}
			{displayCharacter}
		</div>
	)
}

export function FallbackAvatarSkeleton({
	size = "m",
	variant = "outline",
}: VariantProps<typeof fallbackAvatarVariants>) {
	return <Skeleton className={cn(fallbackAvatarVariants({ size, variant }))} />
}
