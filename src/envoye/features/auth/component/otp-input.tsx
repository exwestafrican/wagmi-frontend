import { Button } from "@common/components/ui/button.tsx"
import {
	OtpInput,
	type OtpInputHandle,
} from "@common/components/ui/otp-input.tsx"
import useSpinnerVerbs from "@common/hooks/spinner-verb.ts"
import type { Ref } from "react"

export type { OtpInputHandle }

interface EnvoyeOtpInputProps {
	ref: Ref<OtpInputHandle>
	length: number
	onSubmit: (value: string) => void
	isPending: boolean
}

export function EnvoyeOtpInput({
	ref,
	length,
	onSubmit,
	isPending,
}: EnvoyeOtpInputProps) {
	const spinnerVerb = useSpinnerVerbs()

	return (
		<OtpInput
			ref={ref}
			className="mt-8"
			length={length}
			onSubmit={onSubmit}
			isPending={isPending}
			inputClassName="h-12 w-11 rounded-lg border border-input bg-transparent text-lg font-semibold text-neutral-900 shadow-xs transition-[color,box-shadow] sm:h-14 sm:w-12 sm:text-xl focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
		>
			{({ disabled, onClick }) => (
				<Button
					size="lg"
					disabled={disabled}
					className="w-full cursor-pointer"
					onClick={onClick}
				>
					{isPending ? `${spinnerVerb}...` : "Verify"}
				</Button>
			)}
		</OtpInput>
	)
}
