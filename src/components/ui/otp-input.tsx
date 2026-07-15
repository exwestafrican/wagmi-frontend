import * as React from "react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button.tsx"

export interface OtpInputHandle {
	clear: () => void
}

interface OtpInputProps {
	length?: number
	onSubmit: (value: string) => void
	disabled?: boolean
	autoFocus?: boolean
	className?: string
	submitLabel?: string
}

const OtpInput = React.forwardRef<OtpInputHandle, OtpInputProps>(function OtpInput(
	{ length = 6, onSubmit, disabled, autoFocus, className, submitLabel = "Verify" },
	ref,
) {
	const [digits, setDigits] = useState(() => Array(length).fill(""))
	const inputsRef = React.useRef<Array<HTMLInputElement | null>>([])

	const value = digits.join("")
	const isComplete = value.length === length

	const focusInput = (index: number) => {
		const inputRef = inputsRef.current[index]
		inputRef?.focus()
		inputRef?.select()
	}

	// The parent owns the network call, so error handling (clearing the boxes)
	// is exposed imperatively — the reset lives next to the state it resets.
	React.useImperativeHandle(ref, () => ({
		clear: () => {
			setDigits(Array(length).fill(""))
			focusInput(0)
		},
	}))

	const submit = () => {
		if (value.length === length) onSubmit(value)
	}

	const handleChange = (
		index: number,
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const raw = event.target.value.replace(/\D/g, "")

		const nextDigits = [...digits]
		let cursor = index
		for (const char of raw) {
			if (cursor >= length) break
			nextDigits[cursor] = char
			cursor++
		}

		setDigits(nextDigits)
		focusInput(Math.min(cursor, length - 1))
	}

	const handleKeyDown = (
		index: number,
		event: React.KeyboardEvent<HTMLInputElement>,
	) => {
		if (event.key === "Backspace") {
			event.preventDefault()
			const nextDigits = [...digits]
			if (nextDigits[index]) {
				nextDigits[index] = ""
				setDigits(nextDigits)
			} else if (index > 0) {
				nextDigits[index - 1] = ""
				setDigits(nextDigits)
				focusInput(index - 1)
			}
		} else if (event.key === "ArrowLeft" && index > 0) {
			event.preventDefault()
			focusInput(index - 1)
		} else if (event.key === "ArrowRight" && index < length - 1) {
			event.preventDefault()
			focusInput(index + 1)
		} else if (event.key === "Enter") {
			event.preventDefault()
			submit()
		}
	}

	const handlePaste = (
		index: number,
		event: React.ClipboardEvent<HTMLInputElement>,
	) => {
		event.preventDefault()
		const pasted = event.clipboardData.getData("text").replace(/\D/g, "")
		if (!pasted) return

		const nextDigits = [...digits]
		let cursor = index
		for (const char of pasted) {
			if (cursor >= length) break
			nextDigits[cursor] = char
			cursor++
		}
		setDigits(nextDigits)
		focusInput(Math.min(cursor, length - 1))
	}

	return (
		<div className={cn("flex flex-col items-center gap-6", className)}>
			<div className="flex items-center justify-center gap-2 sm:gap-3">
				{digits.map((digit, index) => (
					<input
						// eslint-disable-next-line react/no-array-index-key
						key={index}
						ref={(el) => {
							inputsRef.current[index] = el
						}}
						type="text"
						inputMode="numeric"
						autoComplete={index === 0 ? "one-time-code" : "off"}
						maxLength={1}
						disabled={disabled}
						autoFocus={autoFocus && index === 0}
						value={digit}
						aria-label={`Digit ${index + 1}`}
						onChange={(event) => handleChange(index, event)}
						onKeyDown={(event) => handleKeyDown(index, event)}
						onPaste={(event) => handlePaste(index, event)}
						onFocus={(event) => event.target.select()}
						className={cn(
							"h-12 w-11 rounded-lg border border-input bg-transparent text-center text-lg font-semibold text-neutral-900 shadow-xs transition-[color,box-shadow] outline-none sm:h-14 sm:w-12 sm:text-xl",
							"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
							"disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
						)}
					/>
				))}
			</div>
			<Button
				size="lg"
				disabled={disabled || !isComplete}
				className="w-full cursor-pointer"
				onClick={submit}
			>
				{submitLabel}
			</Button>
		</div>
	)
})

export { OtpInput }
