import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogTitle,
	DialogTrigger,
} from "@common/components/ui/dialog.tsx"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from "@common/components/ui/sheet.tsx"
import { cn } from "@common/lib/utils.ts"
import { CircleAlert, CircleCheck, X } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import { toast } from "sonner"

// Desktop modal. Compose it like the shared dialog:
// Modal > ModalTrigger + ModalContent > ModalTitle, ModalDescription, ModalFooter.
export const Modal = Dialog
export const ModalTrigger = DialogTrigger
export const ModalClose = DialogClose

export function ModalContent({
	className,
	children,
	closeLabel = "Close",
	...props
}: Omit<ComponentProps<typeof DialogContent>, "showCloseButton"> & {
	closeLabel?: string
}) {
	return (
		<DialogContent
			showCloseButton={false}
			className={cn(
				"gap-4 rounded-fh-lg border-fh-line bg-fh-surface p-7 shadow-fh-modal sm:max-w-[460px]",
				className,
			)}
			{...props}
		>
			{children}
			<DialogClose
				aria-label={closeLabel}
				className="absolute top-7 right-7 rounded-fh-sm text-fh-ink-muted outline-none transition-colors hover:text-fh-ink focus-visible:ring-2 focus-visible:ring-fh-accent-ink"
			>
				<X aria-hidden className="size-5" />
			</DialogClose>
		</DialogContent>
	)
}

export function ModalTitle({
	className,
	...props
}: ComponentProps<typeof DialogTitle>) {
	return (
		<DialogTitle
			className={cn(
				"pr-8 text-xl leading-snug font-bold text-fh-ink",
				className,
			)}
			{...props}
		/>
	)
}

export function ModalDescription({
	className,
	...props
}: ComponentProps<typeof DialogDescription>) {
	return (
		<DialogDescription
			className={cn("text-[15px] leading-[1.45] text-fh-ink-muted", className)}
			{...props}
		/>
	)
}

export function ModalFooter({
	className,
	...props
}: ComponentProps<typeof DialogFooter>) {
	return <DialogFooter className={cn("gap-2.5", className)} {...props} />
}

// Mobile version of the modal: slides up from the bottom with a grabber on top.
export const BottomSheet = Sheet
export const BottomSheetTrigger = SheetTrigger
export const BottomSheetClose = SheetClose

export function BottomSheetContent({
	className,
	children,
	...props
}: Omit<ComponentProps<typeof SheetContent>, "side">) {
	return (
		<SheetContent
			side="bottom"
			className={cn(
				// The shared sheet always adds a corner close button; the design uses
				// the grabber and a Cancel button instead, so it is hidden here.
				"gap-3.5 rounded-t-3xl border-0 bg-fh-surface px-5 pt-2.5 pb-7 [&>button:last-child]:hidden",
				className,
			)}
			{...props}
		>
			<span
				aria-hidden
				className="mx-auto h-[5px] w-9 shrink-0 rounded-[3px] bg-fh-line-strong"
			/>
			{children}
		</SheetContent>
	)
}

export function BottomSheetTitle({
	className,
	...props
}: ComponentProps<typeof SheetTitle>) {
	return (
		<SheetTitle
			className={cn("text-xl font-bold text-fh-ink", className)}
			{...props}
		/>
	)
}

export function BottomSheetDescription({
	className,
	...props
}: ComponentProps<typeof SheetDescription>) {
	return (
		<SheetDescription
			className={cn("text-[15px] text-fh-ink-muted", className)}
			{...props}
		/>
	)
}

type ToastStatus = "success" | "error"

// The toast card itself. Use `showToast` to pop one up.
export function Toast({
	status,
	title,
	body,
	onClose,
	closeLabel = "Dismiss",
	className,
}: {
	status: ToastStatus
	title: ReactNode
	body?: ReactNode
	onClose?: () => void
	closeLabel?: string
	className?: string
}) {
	const StatusIcon = status === "success" ? CircleCheck : CircleAlert

	return (
		<div
			role={status === "error" ? "alert" : "status"}
			className={cn(
				"flex w-full items-center gap-3 rounded-fh-md border bg-fh-surface px-4 py-3.5 font-fahari shadow-fh-toast sm:w-[380px]",
				status === "error" ? "border-fh-error" : "border-fh-line",
				className,
			)}
		>
			<StatusIcon
				aria-hidden
				className={cn(
					"size-[22px] shrink-0",
					status === "error" ? "text-fh-error" : "text-fh-success",
				)}
			/>
			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<p className="text-[15px] font-bold text-fh-ink">{title}</p>
				{body ? <p className="text-[13px] text-fh-ink-muted">{body}</p> : null}
			</div>
			{onClose ? (
				<button
					type="button"
					aria-label={closeLabel}
					onClick={onClose}
					className="shrink-0 rounded-fh-sm text-fh-ink-muted outline-none transition-colors hover:text-fh-ink focus-visible:ring-2 focus-visible:ring-fh-accent-ink"
				>
					<X aria-hidden className="size-4" />
				</button>
			) : null}
		</div>
	)
}

function show(status: ToastStatus, title: ReactNode, body?: ReactNode) {
	return toast.custom((id) => (
		<Toast
			status={status}
			title={title}
			body={body}
			onClose={() => toast.dismiss(id)}
		/>
	))
}

// Pops a Fahari toast through the app's existing toaster.
export const showToast = {
	success: (title: ReactNode, body?: ReactNode) => show("success", title, body),
	error: (title: ReactNode, body?: ReactNode) => show("error", title, body),
}
