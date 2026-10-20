import { cn } from "@common/lib/utils.ts"
import type { ReactNode } from "react"

function FieldContent({
	label,
	value,
	placeholder,
	icon,
	compact,
}: {
	label: string
	value?: string
	placeholder: string
	icon: ReactNode
	compact: boolean
}) {
	return (
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
}

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
	onClick: () => void
}) {
	const className = cn(
		"flex w-full flex-[1_0_0] flex-col items-start rounded-xl border border-[#d7e1e8] bg-white text-left",
		compact ? "gap-0 p-2" : "gap-0.5 p-3",
	)

	return (
		<button
			type="button"
			aria-expanded={open}
			aria-haspopup="dialog"
			onClick={onClick}
			className={className}
			style={{ fontFamily: '"DM Sans", sans-serif' }}
		>
			<FieldContent
				label={label}
				value={value}
				placeholder={placeholder}
				icon={icon}
				compact={compact}
			/>
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
	form,
	invalid = false,
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
	form?: string
	invalid?: boolean
}) {
	return (
		<label
			htmlFor={id}
			className={cn(
				"flex w-full flex-col items-start rounded-xl border border-[#d7e1e8] bg-white text-left",
				compact ? "gap-0 p-2" : "gap-0.5 p-3",
				invalid && "border-red-400",
			)}
			style={{ fontFamily: '"DM Sans", sans-serif' }}
		>
			<span className="text-[9px] leading-none font-semibold uppercase tracking-[0.08em] text-slate-500">
				{label}
			</span>
			<span className="flex w-full items-center justify-between gap-2">
				<input
					id={id}
					form={form}
					type={type}
					value={value}
					placeholder={placeholder}
					autoComplete={autoComplete}
					aria-invalid={invalid || undefined}
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
