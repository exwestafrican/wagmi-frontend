import { Button } from "@common/components/ui/button.tsx"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@common/components/ui/form"
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
import {
	type ClientPickupData,
	clientPickupSchema,
} from "@fahari/features/admin/bookings/schema.ts"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, Plus } from "lucide-react"
import type { ComponentProps, ReactNode } from "react"
import { useState } from "react"
import { useForm, useFormContext, useFormState } from "react-hook-form"

const USE_THE_FLEET = "use-the-fleet"
const CLIENT_PICKUP = "client-pickup"

const fieldLabelClassName =
	"text-[10px] font-semibold text-slate-500 uppercase tracking-wide"

const optionalMark = (
	<span className="font-normal text-slate-400 normal-case">(optional)</span>
)

const submitButtonClassName =
	"h-auto cursor-pointer rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-none hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"

const defaultValues: ClientPickupData = {
	firstName: "",
	lastName: "",
	clientEmail: "",
	pickupLocation: "",
	locationUrl: "",
	pickupDate: "",
	pickupTime: "",
	note: "",
}

function Field({
	id,
	label,
	children,
}: {
	id: string
	label: ReactNode
	children: ReactNode
}) {
	return (
		<div className="flex flex-col gap-1.5">
			<Label htmlFor={id} className={fieldLabelClassName}>
				{label}
			</Label>
			{children}
		</div>
	)
}

function BookingTabsTrigger({
	className,
	...props
}: ComponentProps<typeof TabsTrigger>) {
	return (
		<TabsTrigger
			className={cn(
				"flex-none rounded-none px-0 pb-2.5 text-xs font-semibold data-[state=active]:text-[#4a6030] data-[state=active]:shadow-none after:bg-[#4a6030]",
				className,
			)}
			{...props}
		/>
	)
}

function ClientPickupFields() {
	const form = useFormContext<ClientPickupData>()

	return (
		<form
			id="client-pickup-form"
			noValidate
			onSubmit={form.handleSubmit(() => undefined)}
			className="space-y-5"
		>
			<div className="flex flex-col gap-1.5">
				<span className={fieldLabelClassName}>Client name</span>
				<div className="grid grid-cols-2 gap-2">
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem className="gap-1.5">
								<FormLabel className="sr-only">First name</FormLabel>
								<FormControl>
									<Input
										autoComplete="given-name"
										placeholder="First name"
										className="fahari-field-input text-xs md:text-xs"
										{...field}
									/>
								</FormControl>
								<FormMessage className="mt-1 text-[11px] text-red-500" />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="lastName"
						render={({ field }) => (
							<FormItem className="gap-1.5">
								<FormLabel className="sr-only">Last name (optional)</FormLabel>
								<FormControl>
									<Input
										autoComplete="family-name"
										placeholder="Last name (optional)"
										className="fahari-field-input text-xs md:text-xs"
										{...field}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</div>
			</div>

			<FormField
				control={form.control}
				name="clientEmail"
				render={({ field }) => (
					<FormItem className="gap-1.5">
						<FormLabel className={fieldLabelClassName}>Client email</FormLabel>
						<FormControl>
							<Input
								type="email"
								autoComplete="email"
								placeholder="client@example.com"
								className="fahari-field-input text-xs md:text-xs"
								{...field}
							/>
						</FormControl>
						<FormMessage className="mt-1 text-[11px] text-red-500" />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="pickupLocation"
				render={({ field }) => (
					<FormItem className="gap-1.5">
						<FormLabel className={fieldLabelClassName}>
							Pickup location
						</FormLabel>
						<FormControl>
							<Input
								placeholder="e.g. JKIA Terminal 1, Nairobi"
								className="fahari-field-input text-xs md:text-xs"
								{...field}
							/>
						</FormControl>
						<FormMessage className="mt-1 text-[11px] text-red-500" />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="locationUrl"
				render={({ field }) => (
					<FormItem className="gap-1.5">
						<FormLabel className={fieldLabelClassName}>Location URL</FormLabel>
						<div className="relative">
							<Link
								aria-hidden="true"
								className="pointer-events-none absolute top-1/2 left-3 size-3 -translate-y-1/2 text-slate-400"
							/>
							<FormControl>
								<Input
									inputMode="url"
									autoComplete="off"
									placeholder="e.g. https://maps.google.com/…"
									className="fahari-field-input text-xs md:text-xs pr-3 pl-8"
									{...field}
								/>
							</FormControl>
						</div>
						<FormMessage className="mt-1 text-[11px] text-red-500" />
					</FormItem>
				)}
			/>

			<div className="grid grid-cols-2 gap-3">
				<FormField
					control={form.control}
					name="pickupDate"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className={fieldLabelClassName}>Pickup date</FormLabel>
							<FormControl>
								<Input type="date" className="fahari-field-input text-xs md:text-xs" {...field} />
							</FormControl>
							<FormMessage className="mt-1 text-[11px] text-red-500" />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="pickupTime"
					render={({ field }) => (
						<FormItem className="gap-1.5">
							<FormLabel className={fieldLabelClassName}>Pickup time</FormLabel>
							<FormControl>
								<Input type="time" className="fahari-field-input text-xs md:text-xs" {...field} />
							</FormControl>
							<FormMessage className="mt-1 text-[11px] text-red-500" />
						</FormItem>
					)}
				/>
			</div>

			<Field id="client-pickup-chauffeur" label="Chauffeur">
				<Input
					id="client-pickup-chauffeur"
					role="combobox"
					aria-expanded={false}
					disabled
					placeholder="Search teammate…"
					className="fahari-field-input text-xs md:text-xs disabled:cursor-not-allowed disabled:opacity-60"
				/>
			</Field>

			<FormField
				control={form.control}
				name="note"
				render={({ field }) => (
					<FormItem className="gap-1.5">
						<FormLabel className={fieldLabelClassName}>
							Note {optionalMark}
						</FormLabel>
						<FormControl>
							<Textarea
								placeholder="Did the client ask for anything specific?"
								className="fahari-field-input text-xs md:text-xs min-h-24 resize-none"
								{...field}
							/>
						</FormControl>
					</FormItem>
				)}
			/>
		</form>
	)
}

export function NewBookingSheet() {
	const [tab, setTab] = useState(USE_THE_FLEET)
	const form = useForm<ClientPickupData>({
		resolver: zodResolver(clientPickupSchema),
		defaultValues,
		mode: "onTouched",
	})
	const { isValid } = useFormState({ control: form.control })

	function handleOpenChange(open: boolean) {
		if (!open) {
			form.reset(defaultValues)
			setTab(USE_THE_FLEET)
		}
	}

	return (
		<Sheet onOpenChange={handleOpenChange}>
			<SheetTrigger asChild>
				<Button
					type="button"
					className="h-auto cursor-pointer gap-1.5 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white shadow-none hover:bg-black"
				>
					<Plus className="size-3" strokeWidth={2.5} />
					New booking
				</Button>
			</SheetTrigger>
			<SheetContent className="gap-0 sm:max-w-[420px]">
				<SheetHeader>
					<SheetTitle className="text-sm font-semibold tracking-tight text-slate-900">
						New booking
					</SheetTitle>
					<SheetDescription className="sr-only">
						Create a new fleet booking
					</SheetDescription>
				</SheetHeader>

				<Form {...form}>
					<Tabs
						value={tab}
						onValueChange={setTab}
						className="min-h-0 flex-1 gap-0 px-6"
					>
						<TabsList
							variant="line"
							className="h-auto w-full justify-start gap-6 rounded-none border-b border-slate-100 p-0"
						>
							<BookingTabsTrigger value={USE_THE_FLEET}>
								Use the fleet
							</BookingTabsTrigger>
							<BookingTabsTrigger value={CLIENT_PICKUP}>
								Client pickup
							</BookingTabsTrigger>
						</TabsList>

						<TabsContent
							value={USE_THE_FLEET}
							className="mt-5 min-h-0 space-y-5 overflow-y-auto"
						>
							<Field id="new-booking-teammate" label="Teammate">
								<Input
									id="new-booking-teammate"
									placeholder="Search teammate…"
									className="fahari-field-input text-xs md:text-xs"
								/>
							</Field>
							<Field id="new-booking-date" label="Date">
								<Input
									id="new-booking-date"
									type="date"
									className="fahari-field-input text-xs md:text-xs"
								/>
							</Field>
							<div className="grid grid-cols-2 gap-3">
								<Field id="new-booking-start-time" label="Start time">
									<Input
										id="new-booking-start-time"
										type="time"
										className="fahari-field-input text-xs md:text-xs"
									/>
								</Field>
								<Field id="new-booking-end-time" label="End time">
									<Input
										id="new-booking-end-time"
										type="time"
										className="fahari-field-input text-xs md:text-xs"
									/>
								</Field>
							</div>
							<Field id="new-booking-note" label={<>Note {optionalMark}</>}>
								<Textarea
									id="new-booking-note"
									placeholder="Any details about this booking…"
									className="fahari-field-input text-xs md:text-xs min-h-24 resize-none"
								/>
							</Field>
						</TabsContent>

						<TabsContent
							value={CLIENT_PICKUP}
							className="mt-5 min-h-0 overflow-y-auto"
						>
							<ClientPickupFields />
						</TabsContent>
					</Tabs>

					<SheetFooter className="flex-row justify-end gap-2 px-6">
						<SheetClose asChild>
							<Button
								type="button"
								variant="ghost"
								className="h-auto cursor-pointer px-3 py-1.5 text-xs font-medium text-slate-500"
							>
								Cancel
							</Button>
						</SheetClose>
						{tab === CLIENT_PICKUP ? (
							<Button
								type="submit"
								form="client-pickup-form"
								disabled={!isValid}
								className={submitButtonClassName}
							>
								Book pickup
							</Button>
						) : (
							<Button type="button" className={submitButtonClassName}>
								Book time
							</Button>
						)}
					</SheetFooter>
				</Form>
			</SheetContent>
		</Sheet>
	)
}
