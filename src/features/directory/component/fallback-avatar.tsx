import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils.ts"

const fallbackAvatarVariants = cva(
	"rounded-md  text-base font-semibold flex items-center justify-center w-fit ",
	{
		variants: {
			size: {
				xs: "min-w-6 min-h-6 text-xs",
				sm: "min-w-8 min-h-8 text-sm",
				m: "min-w-10 min-h-10 text-base",
			},
			variant: {
				outline: "border-2 border-solid",
				stone: "bg-stone-200 text-stone-800",
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
