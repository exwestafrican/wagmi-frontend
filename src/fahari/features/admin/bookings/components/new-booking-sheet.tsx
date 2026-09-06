import { Button } from "@common/components/ui/button.tsx"
import { Input } from "@common/components/ui/input.tsx"
import { Label } from "@common/components/ui/label.tsx"
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@common/components/ui/sheet"
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@common/components/ui/tabs.tsx"
import { Textarea } from "@common/components/ui/textarea"
import { cn } from "@common/lib/utils.ts"
import { Plus } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"

function Field({
	id,
	label,
	children,
}: {
	id: string
	label: string
	children: ReactNode
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<Label
				htmlFor={id}
				className="text-[10px] font-semibold uppercase tracking-widest text-slate-400"
			>
				{label}
			</Label>
			{children}
		</div>
	)
}

function fieldControlClassName(className?: string) {
	return cn(
		"h-auto rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-900 shadow-none placeholder:text-slate-300 hover:border-slate-300 focus-visible:border-slate-400 focus-visible:ring-0",
		className,
	)
}

function BookingInput({ className, ...props }: ComponentProps<typeof Input>) {
	return <Input className={fieldControlClassName(className)} {...props} />
}

function BookingTextarea({
	className,
	...props
}: ComponentProps<typeof Textarea>) {
	return (
		<Textarea
			className={fieldControlClassName(cn("min-h-24 resize-none", className))}
			{...props}
		/>
	)
}

function BookingTabsTrigger({
	className,
	...props
}: ComponentProps<typeof TabsTrigger>) {
	return (
		<TabsTrigger
			className={cn(
				"flex-none rounded-none px-0 pb-2.5 text-sm font-medium data-[state=active]:text-[#4a6030] data-[state=active]:shadow-none after:bg-[#4a6030]",
				className,
			)}
			{...props}
		/>
	)
}

export function NewBookingSheet() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					type="button"
					className="h-auto cursor-pointer gap-1.5 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-none hover:bg-black"
				>
					<Plus className="size-3" strokeWidth={2.5} />
					New booking
				</Button>
			</SheetTrigger>
			<SheetContent className="gap-0 sm:max-w-md">
				<SheetHeader>
					<SheetTitle className="text-sm font-semibold tracking-tight text-slate-900">
						New booking
					</SheetTitle>
					<SheetDescription className="sr-only">
						Create a new fleet booking
					</SheetDescription>
				</SheetHeader>

				<Tabs
					defaultValue="use-the-fleet"
					className="min-h-0 flex-1 gap-0 px-4"
				>
					<TabsList
						variant="line"
						className="h-auto w-full justify-start gap-6 rounded-none border-b border-slate-100 p-0"
					>
						<BookingTabsTrigger value="use-the-fleet">
							Use the fleet
						</BookingTabsTrigger>
						<BookingTabsTrigger value="client-pickup">
							Client pickup
						</BookingTabsTrigger>
					</TabsList>

					<TabsContent value="use-the-fleet" className="mt-5 space-y-4">
						<Field id="new-booking-teammate" label="Teammate">
							<BookingInput
								id="new-booking-teammate"
								placeholder="Search teammate..."
							/>
						</Field>
						<Field id="new-booking-date" label="Date">
							<BookingInput id="new-booking-date" type="date" />
						</Field>
						<div className="grid grid-cols-2 gap-3">
							<Field id="new-booking-start-time" label="Start time">
								<BookingInput id="new-booking-start-time" type="time" />
							</Field>
							<Field id="new-booking-end-time" label="End time">
								<BookingInput id="new-booking-end-time" type="time" />
							</Field>
						</div>
						<Field id="new-booking-note" label="Note (optional)">
							<BookingTextarea
								id="new-booking-note"
								placeholder="Any details about this booking..."
							/>
						</Field>
					</TabsContent>

					<TabsContent value="client-pickup" className="mt-5">
						<p className="text-sm text-slate-400">Coming soon</p>
					</TabsContent>
				</Tabs>

				<SheetFooter className="flex-row justify-end gap-2">
					<SheetClose asChild>
						<Button
							type="button"
							variant="ghost"
							className="h-auto cursor-pointer px-3 py-1.5 text-xs font-medium text-slate-500"
						>
							Cancel
						</Button>
					</SheetClose>
					<Button
						type="button"
						className="h-auto cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-none hover:bg-black"
					>
						Book time
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	)
}
