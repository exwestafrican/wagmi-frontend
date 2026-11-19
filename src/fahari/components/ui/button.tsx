import { Button as ShadcnButton } from "@common/components/ui/button.tsx"
import { cn } from "@common/lib/utils.ts"
import { Spinner } from "@fahari/components/ui/spinner.tsx"
import { useFahariThemeStore } from "@fahari/theme/theme.store.ts"
import { type VariantProps, cva } from "class-variance-authority"
import { Moon, Star, Sun } from "lucide-react"
import type { ComponentProps } from "react"

const buttonVariants = cva(
	[
		"relative rounded-full text-[15px] font-bold shadow-none transition-colors",
		"focus-visible:ring-2 disabled:opacity-40",
		"[&_svg:not([class*='size-'])]:size-[18px]",
	],
	{
		variants: {
			variant: {
				primary:
					"bg-fh-accent text-fh-on-accent hover:bg-fh-accent-hover active:bg-fh-accent-pressed focus-visible:ring-fh-ink",
				secondary:
					"bg-fh-inverse text-fh-on-inverse hover:bg-fh-inverse-hover active:bg-fh-inverse-pressed focus-visible:ring-fh-accent-ink",
				outline:
					"border-[1.5px] border-fh-ink bg-transparent text-fh-ink hover:bg-fh-subtle active:bg-fh-line-strong focus-visible:border-fh-accent-ink focus-visible:ring-1 focus-visible:ring-fh-accent-ink",
				link: "rounded-fh-sm bg-transparent text-fh-accent-ink hover:bg-transparent hover:underline active:opacity-70 focus-visible:ring-fh-accent-ink",
			},
			size: {
				default: "h-12 px-6 has-[>svg]:px-6",
				link: "h-8 px-1.5 has-[>svg]:px-1.5",
			},
		},
		defaultVariants: {
			variant: "primary",
		},
	},
)

type ButtonProps = Omit<
	ComponentProps<typeof ShadcnButton>,
	"variant" | "size"
> &
	Pick<VariantProps<typeof buttonVariants>, "variant"> & {
		loading?: boolean
	}

// The four text buttons from the design system: primary, secondary, outline and
// text link. `loading` swaps the label for a spinner without changing the width.
export function Button({
	className,
	variant = "primary",
	loading = false,
	disabled,
	children,
	asChild,
	type = "button",
	...props
}: ButtonProps) {
	const classes = cn(
		buttonVariants({
			variant,
			size: variant === "link" ? "link" : "default",
		}),
		loading && "disabled:opacity-100",
		className,
	)

	if (asChild) {
		return (
			<ShadcnButton asChild className={classes} {...props}>
				{children}
			</ShadcnButton>
		)
	}

	return (
		<ShadcnButton
			type={type}
			className={classes}
			disabled={disabled || loading}
			aria-busy={loading || undefined}
			{...props}
		>
			{loading ? (
				<>
					<Spinner className="absolute" />
					<span className="invisible inline-flex items-center gap-2">
						{children}
					</span>
				</>
			) : (
				children
			)}
		</ShadcnButton>
	)
}

const iconButtonVariants = cva(
	"relative rounded-full p-0 shadow-none transition-colors focus-visible:ring-2 focus-visible:ring-fh-accent-ink disabled:opacity-40",
	{
		variants: {
			variant: {
				surface:
					"border border-fh-line bg-fh-surface text-fh-ink hover:bg-fh-subtle active:bg-fh-line-strong",
				outline:
					"border border-fh-line-strong bg-transparent text-fh-ink hover:bg-fh-subtle active:bg-fh-line-strong",
				// Sits on top of a photo, so it stays white in both modes.
				onPhoto:
					"bg-white text-[#121212] shadow-fh-float hover:bg-[#f5f5f2] active:bg-[#e4e4e0]",
			},
			size: {
				md: "size-11 [&_svg:not([class*='size-'])]:size-[18px]",
				sm: "size-9 [&_svg:not([class*='size-'])]:size-4",
				xs: "size-8 [&_svg:not([class*='size-'])]:size-3.5",
			},
		},
		defaultVariants: {
			variant: "surface",
			size: "md",
		},
	},
)

type IconButtonProps = Omit<
	ComponentProps<typeof ShadcnButton>,
	"variant" | "size" | "aria-label"
> &
	VariantProps<typeof iconButtonVariants> & {
		"aria-label": string
		loading?: boolean
	}

// Round, icon-only button. The label is required because there is no visible text.
export function IconButton({
	className,
	variant,
	size,
	loading = false,
	disabled,
	children,
	type = "button",
	...props
}: IconButtonProps) {
	return (
		<ShadcnButton
			type={type}
			size="icon"
			className={cn(
				iconButtonVariants({ variant, size }),
				loading && "disabled:opacity-100",
				className,
			)}
			disabled={disabled || loading}
			aria-busy={loading || undefined}
			{...props}
		>
			{loading ? <Spinner /> : children}
		</ShadcnButton>
	)
}

// The star that marks an event as "interested". When on, the whole button
// turns accent and the star becomes solid.
export function InterestedButton({
	interested,
	variant = "onPhoto",
	className,
	...props
}: Omit<IconButtonProps, "children" | "aria-label" | "aria-pressed"> & {
	interested: boolean
	"aria-label"?: string
}) {
	return (
		<IconButton
			variant={variant}
			aria-label={interested ? "Remove from interested" : "I'm interested"}
			aria-pressed={interested}
			className={cn(
				interested &&
					"bg-fh-accent text-fh-on-accent hover:bg-fh-accent-hover active:bg-fh-accent-pressed",
				className,
			)}
			{...props}
		>
			<Star aria-hidden className={cn(interested && "fill-current")} />
		</IconButton>
	)
}

// Shows the mode you would switch to: a moon in light mode, a sun in dark mode.
export function ThemeToggle({
	onPhoto = false,
	className,
}: {
	onPhoto?: boolean
	className?: string
}) {
	const mode = useFahariThemeStore((state) => state.mode)
	const toggleMode = useFahariThemeStore((state) => state.toggleMode)
	const isDark = mode === "dark"

	return (
		<IconButton
			variant={onPhoto ? "onPhoto" : "outline"}
			size="sm"
			aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
			onClick={toggleMode}
			className={cn(
				!onPhoto && "border-fh-line [&_svg:not([class*='size-'])]:size-[18px]",
				onPhoto && "[&_svg:not([class*='size-'])]:size-[18px]",
				className,
			)}
		>
			{isDark ? <Sun aria-hidden /> : <Moon aria-hidden />}
		</IconButton>
	)
}

// One pill holding two actions side by side, e.g. "RSVP" and "Interested".
// It is a fieldset so `disabled` switches off both halves at once.
export function SplitPill({ className, ...props }: ComponentProps<"fieldset">) {
	return (
		<fieldset
			className={cn(
				"flex h-14 min-w-0 items-stretch overflow-hidden rounded-full bg-fh-inverse",
				"has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-fh-accent-ink disabled:opacity-40",
				className,
			)}
			{...props}
		/>
	)
}

export function SplitPillButton({
	className,
	type = "button",
	...props
}: ComponentProps<"button">) {
	return (
		<button
			type={type}
			className={cn(
				"relative flex min-w-0 flex-1 items-center justify-center gap-2 text-base font-extrabold text-fh-on-inverse outline-none transition-colors",
				"hover:bg-fh-inverse-hover active:bg-fh-inverse-pressed disabled:pointer-events-none",
				"before:absolute before:left-0 before:h-[26px] before:w-px before:bg-fh-line-strong first:before:hidden",
				"[&_svg]:size-[18px] [&_svg]:shrink-0",
				className,
			)}
			{...props}
		/>
	)
}
