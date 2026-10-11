import { cn } from "@common/lib/utils.ts"
import type { ReactNode } from "react"

export function FieldButton({
	label,
	value,
	placeholder,
	icon,
	open = false,
	compact = false,
	onClick,
}: {
	label: string
	value?: string
	placeholder: string
	icon: ReactNode
	open?: boolean
	compact?: boolean
	onClick?: () => void
}) {
	const content = (
		<>
			<span className="text-[9px] leading-none font-semibold uppercase tracking-[0.08em] text-slate-500">
				{label}
			</span>
			<span className="flex w-full items-center justify-between gap-2">
				<span
					className={cn(
						"flex-[1_0_0] leading-[normal] font-medium text-[#012420]",
						compact ? "text-[11px]" : "text-xs",
						!value && "text-slate-400",
					)}
				>
					{value ?? placeholder}
				</span>
				{icon}
			</span>
		</>
	)
	const className = cn(
		"flex w-full flex-[1_0_0] flex-col items-start rounded-xl border border-[#d7e1e8] bg-white text-left",
		compact ? "gap-0 p-2" : "gap-0.5 p-3",
	)

	if (!onClick) {
		return (
			<div
				className={className}
				style={{ fontFamily: '"DM Sans", sans-serif' }}
			>
				{content}
			</div>
		)
	}

	return (
		<button
			type="button"
			aria-expanded={open}
			aria-haspopup="dialog"
			onClick={onClick}
			className={className}
			style={{ fontFamily: '"DM Sans", sans-serif' }}
		>
			{content}
		</button>
	)
}

export function FieldInput({
	id,
	label,
	value,
	placeholder,
	icon,
	onChange,
	autoComplete,
	type = "text",
	compact = false,
}: {
	id: string
	label: string
	value: string
	placeholder: string
	icon?: ReactNode
	onChange: (value: string) => void
	autoComplete?: string
	type?: "text" | "time"
	compact?: boolean
}) {
	return (
		<label
			htmlFor={id}
			className={cn(
				"flex w-full flex-col items-start rounded-xl border border-[#d7e1e8] bg-white text-left",
				compact ? "gap-0 p-2" : "gap-0.5 p-3",
			)}
			style={{ fontFamily: '"DM Sans", sans-serif' }}
		>
			<span className="text-[9px] leading-none font-semibold uppercase tracking-[0.08em] text-slate-500">
				{label}
			</span>
			<span className="flex w-full items-center justify-between gap-2">
				<input
					id={id}
					type={type}
					value={value}
					placeholder={placeholder}
					autoComplete={autoComplete}
					onChange={(event) => onChange(event.target.value)}
					className={cn(
						"min-w-0 flex-[1_0_0] bg-transparent leading-[normal] font-medium text-[#012420] outline-none placeholder:text-slate-400 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
						compact
							? "text-[11px] [&::-webkit-calendar-picker-indicator]:h-3.5 [&::-webkit-calendar-picker-indicator]:w-3.5"
							: "text-xs",
					)}
				/>
				{icon}
			</span>
		</label>
	)
}
