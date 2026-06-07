import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils.ts"

const variant = cva(
	"rounded-md  text-base font-semibold flex items-center justify-center border-2 border-solid",
	{
		variants: {
			size: {
				xs: "min-w-6 min-h-6 text-xs",
				sm: "min-w-8 min-h-8 text-sm",
				m: "min-w-10 min-h-10 text-base",
			},
		},
		defaultVariants: {
			size: "m",
		},
	},
)

type Props = {
	teammate: Teammate
} & VariantProps<typeof variant>
export default function FallbackAvatar({ teammate, size = "m" }: Props) {
	return (
		<div className={cn(variant({ size }))}>
			{" "}
			{teammate.firstName.charAt(0).toUpperCase()}
		</div>
	)
}
