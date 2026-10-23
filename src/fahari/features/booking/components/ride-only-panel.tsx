import { Button } from "@common/components/ui/button.tsx"
import { Form } from "@common/components/ui/form"
import { Separator } from "@common/components/ui/separator.tsx"
import { Skeleton } from "@common/components/ui/skeleton.tsx"
import { Spinner } from "@common/components/ui/spinner.tsx"
import useSpinnerVerbs from "@common/hooks/spinner-verb.ts"
import { FahariPages } from "@fahari/constants.ts"
import { useBilling } from "@fahari/features/booking/api/calculate-billing.ts"
import {
	toCreateRideRequest,
	useCreateRideRequest,
} from "@fahari/features/booking/api/create-ride-request.ts"
import { ContactDetails } from "@fahari/features/booking/components/contact-fields.tsx"
import {
	CapacityNote,
	GuestPicker,
} from "@fahari/features/booking/components/guest-picker.tsx"
import {
	RideBooking,
	initialRideDates,
} from "@fahari/features/booking/components/ride-booking-card.tsx"
import { formatNightlyPrice } from "@fahari/features/booking/format.ts"
import {
	type Listing,
	maximumRideCapacity,
} from "@fahari/features/booking/listing.ts"
import {
	type Booking,
	bookingSchema,
} from "@fahari/features/booking/schema/booking.schema.ts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from "@tanstack/react-router"
import { differenceInCalendarDays } from "date-fns"
import { ArrowRight, Car } from "lucide-react"
import { useState } from "react"
import { useForm, useFormState } from "react-hook-form"
import { sileo } from "sileo"

export function RideOnlyPanel({ listing }: { listing: Listing }) {
	const navigate = useNavigate()
	const maxPassengers = maximumRideCapacity(listing)
	const spinnerVerb = useSpinnerVerbs()
	const [passengers, setPassengers] = useState(1)
	const form = useForm<Booking>({
		resolver: zodResolver(bookingSchema),
		mode: "onChange",
		defaultValues: {
			pickupAddress: "",
			...initialRideDates(),
			pickupTime: listing.schedule.startTime,
			departureTime: listing.schedule.endTime,
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
		},
	})
	const { isValid } = useFormState({ control: form.control })
	const {
		mutateAsync: createRideRequest,
		isPending,
		isSuccess,
	} = useCreateRideRequest()
	const pickupDate = form.watch("pickupDate")
	const departureDate = form.watch("departureDate")
	const days = differenceInCalendarDays(departureDate, pickupDate)
	const ride = useBilling(listing.code, days, "ride", passengers, true)
	const price =
		ride.data === undefined
			? undefined
			: formatNightlyPrice(ride.data.amount, listing.currency)

	function onSubmit(values: Booking) {
		void sileo
			.promise(
				createRideRequest(
					toCreateRideRequest(values, listing.code, passengers),
				),
				{
					position: "top-center",
					loading: { title: "Requesting this car" },
					success: {
						title: "Ride requested",
						description:
							"Your ride has been successfully requested. The team has been notified and will reach out within 48 hours. \u2728",
					},
					error: {
						title: "Couldn't request this ride",
						description: (
							<>
								Please reach out to us at{" "}
								<a
									href="mailto:humans@fahari.io"
									data-sileo-button
									onClick={(event) => event.stopPropagation()}
									style={{
										display: "inline",
										height: "auto",
										marginTop: 0,
										padding: 0,
										borderRadius: 0,
										background: "transparent",
										fontSize: "inherit",
										fontWeight: "inherit",
										textDecoration: "underline",
									}}
								>
									humans@fahari.io
								</a>
							</>
						),
					},
				},
			)
			.then(() => {
				navigate({ to: FahariPages.BOOKING_SUCCESS })
			})
			.catch(() => undefined)
	}

	return (
		<Form {...form}>
			<form
				noValidate
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex min-h-dvh w-full flex-col gap-2.5 bg-white p-4 md:min-h-0 md:rounded-xl"
				style={{ fontFamily: "Inter, sans-serif" }}
			>
				<div className="flex items-start justify-between gap-3">
					<h1 className="text-[27px] leading-normal font-black text-[#012420]">
						Make this your ride
					</h1>
					<Car className="mt-2.5 size-5 shrink-0 text-[#7eaea0]" aria-hidden />
				</div>
				<p className="flex items-baseline text-[#012420]">
					{price ? (
						<span className="text-xl leading-normal font-semibold">
							{price}
						</span>
					) : (
						<Skeleton className="h-5 w-24" aria-hidden />
					)}
					<span className="text-sm leading-normal font-normal">
						&nbsp;total
					</span>
				</p>
				<p className="text-xs text-slate-600">
					Private ride to {listing.name} and back
				</p>
				<GuestPicker
					passengers={passengers}
					maxCapacity={maxPassengers}
					onPassengersChange={setPassengers}
				/>
				<CapacityNote max={maxPassengers} />
				<Separator />
				<RideBooking
					destinationName={listing.name}
					meetingPointName={listing.meetingPoint.name}
				/>
				{price && (
					<p className="text-[11px] leading-snug text-slate-500">
						Your car includes pickup to the resort and the return ride. {price}{" "}
						covers both journeys.
					</p>
				)}
				<Separator />
				<div className="mb-2">
					<ContactDetails />
				</div>

				<Separator />
				<div className="flex flex-col gap-2 text-[#012420]">
					{ride.isError ? (
						<div className="flex items-center justify-between text-xs text-red-600">
							<span>Car / return ride</span>
							<span>Not available for this guest size.</span>
						</div>
					) : (
						<div className="flex items-center justify-between text-xs">
							<span>Car / return ride</span>
							{price ? (
								<span>{price}</span>
							) : (
								<Skeleton className="h-3 w-16" aria-hidden />
							)}
						</div>
					)}
					<Separator className="mb-2" />
					<div className="flex items-center justify-between">
						<span className="text-sm font-semibold">Car booking total</span>
						<span className="text-lg leading-[normal] font-semibold">
							{price ? price : <Skeleton className="h-4 w-20" aria-hidden />}
						</span>
					</div>
					<Button
						type="submit"
						disabled={!isValid || isPending || isSuccess || ride.isError}
						className="w-full cursor-pointer bg-[#10241c] text-[13px] font-semibold hover:bg-[#10241c]/90"
					>
						{isPending ? (
							<>
								<Spinner />
								{spinnerVerb}...
							</>
						) : (
							<>
								Request this car
								<ArrowRight />
							</>
						)}
					</Button>
				</div>
			</form>
		</Form>
	)
}
