import * as React from "react"

import { cn } from "@/lib/utils"

interface OtpInputProps {
	length?: number
	value: string
	onChange: (value: string) => void
	onComplete?: (value: string) => void
	disabled?: boolean
	className?: string
	autoFocus?: boolean
}

function OtpInput({
	length = 6,
	value,
	onChange,
	onComplete,
	disabled,
	className,
	autoFocus,
}: OtpInputProps) {
	const inputsRef = React.useRef<Array<HTMLInputElement | null>>([])

	const digits = React.useMemo(() => {
		const chars = value.split("").slice(0, length)
		return Array.from({ length }, (_, i) => chars[i] ?? "")
	}, [value, length])

	const focusInput = (index: number) => {
		const next = inputsRef.current[index]
		next?.focus()
		next?.select()
	}

	const emit = (nextDigits: string[]) => {
		const nextValue = nextDigits.join("")
		onChange(nextValue)
		if (nextValue.length === length && !nextValue.includes("")) {
			onComplete?.(nextValue)
		}
	}

	const handleChange = (
		index: number,
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const raw = event.target.value.replace(/\D/g, "")
		if (!raw) return

		const nextDigits = [...digits]
		// Support typing/pasting multiple digits starting at this box.
		const chars = raw.split("")
		let cursor = index
		for (const char of chars) {
			if (cursor >= length) break
			nextDigits[cursor] = char
			cursor++
		}

		emit(nextDigits)
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
				emit(nextDigits)
			} else if (index > 0) {
				nextDigits[index - 1] = ""
				emit(nextDigits)
				focusInput(index - 1)
			}
		} else if (event.key === "ArrowLeft" && index > 0) {
			event.preventDefault()
			focusInput(index - 1)
		} else if (event.key === "ArrowRight" && index < length - 1) {
			event.preventDefault()
			focusInput(index + 1)
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
		for (const char of pasted.split("")) {
			if (cursor >= length) break
			nextDigits[cursor] = char
			cursor++
		}
		emit(nextDigits)
		focusInput(Math.min(cursor, length - 1))
	}

	return (
		<div className={cn("flex items-center justify-center gap-2 sm:gap-3", className)}>
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
	)
}

export { OtpInput }
