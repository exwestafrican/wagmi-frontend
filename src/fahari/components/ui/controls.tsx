import { Checkbox as ShadcnCheckbox } from "@common/components/ui/checkbox.tsx"
import { Switch as ShadcnSwitch } from "@common/components/ui/switch.tsx"
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@common/components/ui/toggle-group.tsx"
import { cn } from "@common/lib/utils.ts"
import { IconButton } from "@fahari/components/ui/button.tsx"
import { CloudUpload, FileIcon, Minus, Plus, X } from "lucide-react"
import {
	type ComponentProps,
	type DragEvent,
	type ReactNode,
	useEffect,
	useId,
	useState,
} from "react"

// Minus / count / plus. The buttons fade out when the count hits either end.
export function Stepper({
	value,
	onChange,
	min = 1,
	max,
	decreaseLabel = "Decrease",
	increaseLabel = "Increase",
	className,
}: {
	value: number
	onChange: (value: number) => void
	min?: number
	max?: number
	decreaseLabel?: string
	increaseLabel?: string
	className?: string
}) {
	const buttonClasses =
		"size-10 border-[1.5px] border-fh-line-strong disabled:opacity-35"

	return (
		<div className={cn("flex items-center gap-3.5", className)}>
			<IconButton
				variant="outline"
				aria-label={decreaseLabel}
				disabled={value <= min}
				onClick={() => onChange(Math.max(min, value - 1))}
				className={buttonClasses}
			>
				<Minus aria-hidden />
			</IconButton>
			<output
				aria-live="polite"
				className="min-w-5 text-center text-lg font-extrabold text-fh-ink tabular-nums"
			>
				{value}
			</output>
			<IconButton
				variant="outline"
				aria-label={increaseLabel}
				disabled={max !== undefined && value >= max}
				onClick={() =>
					onChange(max === undefined ? value + 1 : Math.min(max, value + 1))
				}
				className={buttonClasses}
			>
				<Plus aria-hidden />
			</IconButton>
		</div>
	)
}

// The on/off toggle. Thumb size and travel live in theme.css under `.fh-switch`.
export function Switch({
	className,
	...props
}: Omit<ComponentProps<typeof ShadcnSwitch>, "size">) {
	return (
		<ShadcnSwitch
			className={cn(
				"fh-switch border-0 px-[3px] shadow-none data-[size=default]:h-7 data-[size=default]:w-12",
				"data-[state=checked]:bg-fh-accent data-[state=unchecked]:bg-fh-line-strong dark:data-[state=unchecked]:bg-fh-line-strong",
				"focus-visible:ring-2 focus-visible:ring-fh-accent-ink disabled:opacity-40",
				className,
			)}
			{...props}
		/>
	)
}

// A checkbox with its label. Pass children for the label text.
export function Checkbox({
	className,
	children,
	id,
	disabled,
	...props
}: ComponentProps<typeof ShadcnCheckbox>) {
	const generatedId = useId()
	const checkboxId = id ?? generatedId

	return (
		<div
			className={cn(
				"flex items-center gap-2.5",
				disabled && "opacity-40",
				className,
			)}
		>
			<ShadcnCheckbox
				id={checkboxId}
				disabled={disabled}
				className={cn(
					"size-5 rounded-[6px] border-[1.5px] border-fh-line-strong bg-transparent shadow-none dark:bg-transparent",
					"data-[state=checked]:border-fh-accent data-[state=checked]:bg-fh-accent data-[state=checked]:text-fh-on-accent dark:data-[state=checked]:bg-fh-accent",
					"focus-visible:border-2 focus-visible:border-fh-accent-ink focus-visible:ring-0 disabled:opacity-100",
				)}
				{...props}
			/>
			{children ? (
				<label
					htmlFor={checkboxId}
					className="text-[15px] font-semibold text-fh-ink"
				>
					{children}
				</label>
			) : null}
		</div>
	)
}

export interface SegmentedOption<Value extends string> {
	value: Value
	label: ReactNode
	icon?: ReactNode
}

// Pick exactly one of a few options, e.g. "Free (RSVP)" or "Paid (tickets)".
export function Segmented<Value extends string>({
	value,
	onValueChange,
	options,
	className,
	...props
}: {
	value: Value
	onValueChange: (value: Value) => void
	options: SegmentedOption<Value>[]
	className?: string
	"aria-label"?: string
	"aria-labelledby"?: string
}) {
	return (
		<ToggleGroup
			type="single"
			value={value}
			// Clicking the selected option again would clear it; keep one always chosen.
			onValueChange={(next) => {
				if (next) onValueChange(next as Value)
			}}
			spacing={1}
			className={cn(
				"w-full rounded-full border border-fh-line bg-fh-subtle p-1",
				className,
			)}
			{...props}
		>
			{options.map((option) => (
				<ToggleGroupItem
					key={option.value}
					value={option.value}
					className={cn(
						"h-auto flex-1 gap-2 rounded-full px-4 py-2.5 text-[15px] font-semibold text-fh-ink-muted",
						"hover:bg-transparent hover:text-fh-ink focus-visible:ring-2 focus-visible:ring-fh-accent-ink",
						"data-[state=on]:bg-fh-inverse data-[state=on]:font-extrabold data-[state=on]:text-fh-on-inverse",
						"[&_svg:not([class*='size-'])]:size-4",
					)}
				>
					{option.icon}
					{option.label}
				</ToggleGroupItem>
			))}
		</ToggleGroup>
	)
}

// Whether a file fits an `accept` list such as "image/*,.pdf".
function matchesAccept(file: File, accept?: string) {
	if (!accept) return true
	return accept
		.split(",")
		.map((rule) => rule.trim().toLowerCase())
		.filter(Boolean)
		.some((rule) => {
			if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule)
			if (rule.endsWith("/*")) return file.type.startsWith(rule.slice(0, -1))
			return file.type === rule
		})
}

// A temporary address the browser can show a just-picked file from.
function useFilePreviewUrl(file: File | undefined) {
	const [url, setUrl] = useState<string>()

	useEffect(() => {
		if (!file) {
			setUrl(undefined)
			return
		}
		const objectUrl = URL.createObjectURL(file)
		setUrl(objectUrl)
		return () => URL.revokeObjectURL(objectUrl)
	}, [file])

	return url
}

// Click or drop to choose files. Shows the error in place of the hint. Pass the
// chosen file (or the address of an already saved image) as `value` to show it
// in the box; clicking the box again replaces it.
export function UploadBox({
	title = "Upload cover image",
	hint,
	error,
	accept,
	multiple = false,
	disabled = false,
	onFiles,
	value,
	onRemove,
	previewAlt = "Chosen file",
	removeLabel = "Remove file",
	className,
}: {
	title?: ReactNode
	hint?: ReactNode
	error?: ReactNode
	accept?: string
	multiple?: boolean
	disabled?: boolean
	onFiles: (files: File[]) => void
	value?: File | string | null
	// Shows a remove button on the preview when given.
	onRemove?: () => void
	previewAlt?: string
	removeLabel?: string
	className?: string
}) {
	const [dragging, setDragging] = useState(false)
	const file = value instanceof File ? value : undefined
	const fileUrl = useFilePreviewUrl(
		file?.type.startsWith("image/") ? file : undefined,
	)
	const imageUrl = typeof value === "string" ? value : fileUrl
	const hasValue = Boolean(value)

	function handleDrop(event: DragEvent<HTMLLabelElement>) {
		event.preventDefault()
		setDragging(false)
		if (disabled) return
		const files = Array.from(event.dataTransfer.files).filter((dropped) =>
			matchesAccept(dropped, accept),
		)
		if (files.length) onFiles(multiple ? files : files.slice(0, 1))
	}

	return (
		<div className={cn("relative h-[180px] w-full", className)}>
			<label
				onDragOver={(event) => {
					event.preventDefault()
					setDragging(true)
				}}
				onDragLeave={() => setDragging(false)}
				onDrop={handleDrop}
				className={cn(
					"flex size-full cursor-pointer flex-col items-center justify-center gap-2.5 overflow-hidden rounded-fh-lg border-[1.5px] border-dashed border-fh-line-strong bg-fh-surface px-4 text-center transition-colors",
					"hover:bg-fh-subtle has-[:focus-visible]:border-fh-accent-ink",
					dragging && "bg-fh-subtle",
					hasValue && "border-solid border-fh-line",
					imageUrl && "p-0",
					error && "border-fh-error",
					disabled && "pointer-events-none opacity-50",
				)}
			>
				<input
					type="file"
					accept={accept}
					multiple={multiple}
					disabled={disabled}
					className="sr-only"
					onChange={(event) => {
						const files = Array.from(event.target.files ?? [])
						if (files.length) onFiles(files)
						event.target.value = ""
					}}
				/>
				{imageUrl ? (
					<img
						src={imageUrl}
						alt={previewAlt}
						className="size-full object-cover"
					/>
				) : file ? (
					<>
						<span className="flex size-12 items-center justify-center rounded-full bg-fh-subtle text-fh-accent-ink">
							<FileIcon aria-hidden className="size-[22px]" />
						</span>
						<span className="max-w-full truncate text-[15px] font-bold text-fh-ink">
							{file.name}
						</span>
					</>
				) : (
					<>
						<span className="flex size-12 items-center justify-center rounded-full bg-fh-subtle text-fh-accent-ink">
							<CloudUpload aria-hidden className="size-[22px]" />
						</span>
						<span className="text-[15px] font-bold text-fh-ink">{title}</span>
						{error ? (
							<span role="alert" className="text-[13px] text-fh-error">
								{error}
							</span>
						) : hint ? (
							<span className="text-[13px] text-fh-ink-muted">{hint}</span>
						) : null}
					</>
				)}
			</label>
			{hasValue && onRemove && !disabled ? (
				<IconButton
					variant="onPhoto"
					size="xs"
					aria-label={removeLabel}
					onClick={onRemove}
					className="absolute top-2.5 right-2.5"
				>
					<X aria-hidden />
				</IconButton>
			) : null}
		</div>
	)
}
