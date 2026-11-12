import { apiClient } from "@common/lib/api-client.ts"
import { mockGetUrls, mockPostUrls } from "@common/test/helpers/mocks.ts"
import { navigateToTestPage } from "@envoye/test/helpers/navigate.tsx"
import { FahariApiPaths } from "@fahari/constants.ts"
import { initialBookingSchedule } from "@fahari/features/booking/chauffeur-client.ts"
import {
	formatNightlyPrice,
	formatRideDateTime,
} from "@fahari/features/booking/format.ts"
import { chauffeurClientFactory } from "@fahari/test/factory/chauffeur-client.ts"
import { act, screen, waitFor } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { HttpStatusCode } from "axios"
import { beforeEach, describe, expect, test, vi } from "vitest"

describe("Fahari booking", () => {
	let user: UserEvent

	beforeEach(() => {
		user = userEvent.setup()
	})

	async function openBooking(
		client = chauffeurClientFactory.build(),
		amount = client.vehicles[0]?.sameDayPrice ?? "0.00",
	) {
		await act(async () => {
			mockGetUrls()
				.url(FahariApiPaths.CHAUFFEUR_CLIENT)
				.respond(client)
				.url(FahariApiPaths.RIDE_FARE)
				.respond({ amount })
				.apply()
			await navigateToTestPage({
				to: "/booking",
				search: { code: client.code },
				product: "fahari",
			})
		})
		expect(
			await screen.findByRole("heading", { name: "Make this your ride" }),
		).toBeInTheDocument()
		return client
	}

	async function fillContact() {
		await user.type(
			screen.getByRole("textbox", { name: "First name *" }),
			"Ada",
		)
		await user.type(
			screen.getByRole("textbox", { name: "Last name *" }),
			"Okafor",
		)
		await user.type(
			screen.getByRole("textbox", { name: "Email address *" }),
			"ada.okafor@gmail.com",
		)
		await user.type(
			screen.getByRole("textbox", { name: "Phone number *" }),
			"08031234567",
		)
	}

	test("client names are title-cased and a same-day return uses the same-day price", async () => {
		const araIye = await openBooking(
			chauffeurClientFactory.build({
				name: "ara iye",
				meetupPoint: {
					name: "ara iye reception",
					address: "owode ogun state",
					nearestLandmark: null,
				},
			}),
		)
		const sameDayPrice = formatNightlyPrice(
			Number(araIye.vehicles[0].sameDayPrice),
			"NGN",
		)

		await waitFor(() => {
			expect(document.title).toBe("Fahari - Ara Iye")
		})
		expect(
			screen.getByText("Private ride to Ara Iye Reception and back"),
		).toBeInTheDocument()
		expect(screen.getByText("Going")).toBeInTheDocument()
		expect(screen.getByText("Leaving")).toBeInTheDocument()
		expect(
			screen.getByText("Destination: Ara Iye Reception"),
		).toBeInTheDocument()
		expect(screen.getByText("Pickup: Ara Iye Reception")).toBeInTheDocument()
		expect(screen.getByLabelText("Pickup time")).toHaveValue("15:00")
		expect(screen.getByLabelText("Departure time")).toHaveValue("18:00")
		expect(
			screen.getByText(
				"Your car includes pickup to the resort and the return ride. The total covers both journeys",
			),
		).toBeInTheDocument()
		expect(screen.getAllByText(sameDayPrice).length).toBeGreaterThan(0)
		const schedule = initialBookingSchedule(araIye)
		expect(vi.mocked(apiClient.get)).toHaveBeenCalledWith(
			FahariApiPaths.RIDE_FARE,
			{
				params: {
					clientCode: araIye.code,
					pickupDateTime: formatRideDateTime(
						schedule.pickupDate,
						schedule.pickupTime,
					),
					returnDateTime: formatRideDateTime(
						schedule.departureDate,
						schedule.departureTime,
					),
				},
			},
		)
		expect(
			screen.queryByText("Departure must be after pickup."),
		).not.toBeInTheDocument()
	})

	test("a return on a later day uses the multi-day price", async () => {
		const araIye = chauffeurClientFactory.build({
			bookingPolicy: {
				maxDaysAfterPickup: 2,
				minDaysBeforeTrip: 5,
				maxDaysBeforeTrip: 40,
			},
		})
		const schedule = initialBookingSchedule(araIye)
		await openBooking(araIye, araIye.vehicles[0].multiDayPrice)

		expect(
			screen.getAllByText(
				formatNightlyPrice(Number(araIye.vehicles[0].multiDayPrice), "NGN"),
			).length,
		).toBeGreaterThan(0)
		expect(vi.mocked(apiClient.get)).toHaveBeenCalledWith(
			FahariApiPaths.RIDE_FARE,
			{
				params: {
					clientCode: araIye.code,
					pickupDateTime: formatRideDateTime(
						schedule.pickupDate,
						schedule.pickupTime,
					),
					returnDateTime: formatRideDateTime(
						schedule.departureDate,
						schedule.departureTime,
					),
				},
			},
		)
		expect(
			screen.queryByText("Departure must be after pickup."),
		).not.toBeInTheDocument()
	})

	test("a drop-off shows only the going leg", async () => {
		const softDays = chauffeurClientFactory.build({
			name: "soft days by Ade x Ede",
			code: "softdays",
			tagLine: "Slow travel for creatives in africa",
			tripType: {
				code: "dropoff",
				description: "take from home to meetup location",
			},
			fareNote: null,
			meetupPoint: {
				name: "seme border",
				address: "lagos badagry express way",
				nearestLandmark: null,
			},
			vehicles: [
				{
					operator: "fahari",
					name: "Toyota Camry",
					maximumPassengers: 3,
					sameDayPrice: "75000.00",
					multiDayPrice: "150000.00",
				},
			],
		})
		await openBooking(softDays)

		await waitFor(() => {
			expect(document.title).toBe("Fahari - Soft Days By Ade X Ede")
		})
		expect(screen.getByText("Private ride to Seme Border")).toBeInTheDocument()
		expect(screen.getByText("Going")).toBeInTheDocument()
		expect(screen.queryByText("Leaving")).not.toBeInTheDocument()
		expect(screen.getByText("Destination: Seme Border")).toBeInTheDocument()
		expect(
			screen.queryByText(/Your car includes pickup/),
		).not.toBeInTheDocument()
		expect(
			screen.getAllByText(formatNightlyPrice(75_000, "NGN")).length,
		).toBeGreaterThan(0)
		const schedule = initialBookingSchedule(softDays)
		expect(vi.mocked(apiClient.get)).toHaveBeenCalledWith(
			FahariApiPaths.RIDE_FARE,
			{
				params: {
					clientCode: softDays.code,
					pickupDateTime: formatRideDateTime(
						schedule.pickupDate,
						schedule.pickupTime,
					),
					returnDateTime: formatRideDateTime(
						schedule.departureDate,
						schedule.departureTime,
					),
				},
			},
		)
	})

	test("user cannot add more passengers than the car capacity", async () => {
		await openBooking()

		const addAdult = screen.getByRole("button", { name: "Add adult" })
		expect(addAdult).toBeEnabled()
		expect(screen.getByText("1 adult")).toBeInTheDocument()

		await user.click(addAdult)
		expect(screen.getByText("2 adults")).toBeInTheDocument()
		expect(addAdult).toBeEnabled()

		await user.click(addAdult)
		expect(screen.getByText("3 adults")).toBeInTheDocument()
		expect(addAdult).toBeDisabled()

		await user.click(addAdult)
		expect(screen.getByText("3 adults")).toBeInTheDocument()
	})

	test("user can fill in the pickup address and contact details", async () => {
		await openBooking()

		const pickup = screen.getByRole("textbox", { name: "Pick me up from" })
		const landmark = screen.getByRole("textbox", { name: "Nearest landmark" })
		const firstName = screen.getByRole("textbox", { name: "First name *" })
		const lastName = screen.getByRole("textbox", { name: "Last name *" })
		const email = screen.getByRole("textbox", { name: "Email address *" })
		const phone = screen.getByRole("textbox", { name: "Phone number *" })

		await user.type(pickup, "12 Admiralty Way, Lekki")
		await user.type(landmark, "Opposite Shoprite")
		await user.type(firstName, "Ada")
		await user.type(lastName, "Okafor")
		await user.type(email, "ada.okafor@gmail.com")
		await user.type(phone, "08031234567")

		expect(pickup).toHaveValue("12 Admiralty Way, Lekki")
		expect(landmark).toHaveValue("Opposite Shoprite")
		expect(firstName).toHaveValue("Ada")
		expect(lastName).toHaveValue("Okafor")
		expect(email).toHaveValue("ada.okafor@gmail.com")
		expect(phone).toHaveValue("08031234567")
	})

	test("request stays disabled until the form is valid", async () => {
		await openBooking()

		const request = screen.getByRole("button", { name: "Request this car" })
		expect(request).toBeDisabled()

		await user.type(
			screen.getByRole("textbox", { name: "Pick me up from" }),
			"12 Admiralty Way, Lekki",
		)
		await user.type(
			screen.getByRole("textbox", { name: "First name *" }),
			"Ada",
		)
		await user.type(
			screen.getByRole("textbox", { name: "Last name *" }),
			"Okafor",
		)
		await user.type(
			screen.getByRole("textbox", { name: "Email address *" }),
			"ada.okafor@gmail.com",
		)

		expect(request).toBeDisabled()
		expect(vi.mocked(apiClient.post)).not.toHaveBeenCalled()

		await user.type(
			screen.getByRole("textbox", { name: "Phone number *" }),
			"08031234567",
		)

		expect(request).toBeEnabled()
	})

	test("valid form submits a ride request", async () => {
		const araIye = chauffeurClientFactory.build()
		const { pickupDate, departureDate, departureTime } =
			initialBookingSchedule(araIye)
		mockPostUrls(apiClient)
			.url(FahariApiPaths.RIDE_REQUESTS)
			.respond({ id: 1 })
			.apply()
		await openBooking(araIye)

		await user.type(
			screen.getByRole("textbox", { name: "Pick me up from" }),
			"12 Admiralty Way, Lekki",
		)
		await user.type(
			screen.getByRole("textbox", { name: "Nearest landmark" }),
			"Opposite Shoprite",
		)
		await fillContact()

		await user.click(screen.getByRole("button", { name: "Request this car" }))

		await waitFor(() => {
			expect(vi.mocked(apiClient.post)).toHaveBeenCalledWith(
				FahariApiPaths.RIDE_REQUESTS,
				{
					experienceCode: araIye.code,
					numberOfPassengers: 1,
					pickupLocation: "12 Admiralty Way, Lekki",
					nearestLandmark: "Opposite Shoprite",
					pickupDateTime: formatRideDateTime(pickupDate, "15:00"),
					departureDateTime: formatRideDateTime(departureDate, departureTime),
					firstName: "Ada",
					lastName: "Okafor",
					email: "ada.okafor@gmail.com",
					phoneNumber: {
						countryCallingCode: "+234",
						nationalNumber: "8031234567",
					},
				},
			)
		})
		expect(
			await screen.findByRole("heading", {
				name: /Your ride request is successful/,
			}),
		).toBeInTheDocument()
		expect(await screen.findByText("Ride requested")).toBeInTheDocument()
		expect(
			await screen.findByText(
				"Your ride has been successfully requested. The team has been notified and will reach out within 48 hours. \u2728",
			),
		).toBeInTheDocument()
		expect(
			screen.getByRole("link", { name: "humans@fahari.io" }),
		).toHaveAttribute("href", "mailto:humans@fahari.io")
	})

	test("failed ride request shows an error", async () => {
		mockPostUrls(apiClient)
			.url(FahariApiPaths.RIDE_REQUESTS)
			.fail(HttpStatusCode.BadRequest)
			.apply()
		await openBooking()

		await user.type(
			screen.getByRole("textbox", { name: "Pick me up from" }),
			"12 Admiralty Way, Lekki",
		)
		await user.type(
			screen.getByRole("textbox", { name: "Nearest landmark" }),
			"Opposite Shoprite",
		)
		await fillContact()

		await user.click(screen.getByRole("button", { name: "Request this car" }))

		expect(
			await screen.findByText("Couldn't request this ride"),
		).toBeInTheDocument()
		const email = await screen.findByRole("link", { name: "humans@fahari.io" })
		expect(email).toHaveAttribute("href", "mailto:humans@fahari.io")
		expect(email.closest("[data-sileo-description]")).toHaveTextContent(
			"Please reach out to us at humans@fahari.io",
		)
	})

	test("an unknown code shows the not-found message", async () => {
		await act(async () => {
			mockGetUrls()
				.url(FahariApiPaths.CHAUFFEUR_CLIENT)
				.fail(HttpStatusCode.NotFound)
				.apply()
			await navigateToTestPage({
				to: "/booking",
				search: { code: "missing" },
				product: "fahari",
			})
		})

		expect(
			await screen.findByText("No stay matches this code."),
		).toBeInTheDocument()
	})
})
