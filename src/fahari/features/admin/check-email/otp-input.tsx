import { Button } from "@common/components/ui/button.tsx"
import {
	OtpInput,
	type OtpInputHandle,
} from "@common/components/ui/otp-input.tsx"
import type { Ref } from "react"

export type { OtpInputHandle }

interface FahariOtpInputProps {
	ref: Ref<OtpInputHandle>
	length: number
	onSubmit: (value: string) => void
	isPending: boolean
}

export function FahariOtpInput({
	ref,
	length,
	onSubmit,
	isPending,
}: FahariOtpInputProps) {
	return (
		<OtpInput
			ref={ref}
			className="w-full gap-4"
			length={length}
			onSubmit={onSubmit}
			isPending={isPending}
			inputClassName="h-auto w-full aspect-square rounded-md border border-slate-200 bg-transparent font-mono text-lg font-semibold text-slate-900 shadow-none hover:border-slate-300 focus-visible:border-slate-900 focus-visible:ring-0 sm:h-auto sm:w-full sm:text-lg"
		>
			{({ disabled, onClick, isPending: submitPending }) => (
				<Button
					type="button"
					disabled={disabled}
					onClick={onClick}
					className="h-auto w-full cursor-pointer rounded-md bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-none hover:bg-black disabled:opacity-60"
				>
					{submitPending ? "Verifying…" : "Verify & sign in"}
				</Button>
			)}
		</OtpInput>
	)
}
