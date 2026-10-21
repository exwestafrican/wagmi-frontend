import { apiClient } from "@common/lib/api-client.ts"
import { mockGetUrls, mockPostUrls } from "@common/test/helpers/mocks.ts"
import { navigateToTestPage } from "@envoye/test/helpers/navigate.tsx"
import { FahariApiPaths } from "@fahari/constants.ts"
import { initialRideDates } from "@fahari/features/booking/components/ride-booking-card.tsx"
import { formatRideDateTime } from "@fahari/features/booking/format.ts"
import { listingFactory } from "@fahari/test/factory/listing.ts"
import { act, screen, waitFor } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { beforeEach, describe, expect, test, vi } from "vitest"

describe("Fahari booking", () => {
	let user: UserEvent

	beforeEach(() => {
		user = userEvent.setup()
	})

	async function openAraIyeBooking() {
		const araIye = listingFactory.build()
		await act(async () => {
			mockGetUrls()
				.url(FahariApiPaths.BOOKING)
				.respond(araIye)
				.url(FahariApiPaths.CALCULATE)
				.respond({ amount: 88245 })
				.apply()
			await navigateToTestPage({
				to: "/booking",
				search: { code: araIye.code },
			})
		})
		expect(
			await screen.findByRole("heading", { name: "Make this your ride" }),
		).toBeInTheDocument()
	}

	test("user cannot add more passengers than the car capacity", async () => {
		await openAraIyeBooking()

		const addAdult = screen.getByRole("button", { name: "Add adult" })
		expect(addAdult).toBeEnabled()
		expect(screen.getByText("1 adult")).toBeInTheDocument()

		await user.click(addAdult)

		expect(screen.getByText("2 adults")).toBeInTheDocument()
		expect(addAdult).toBeDisabled()

		await user.click(addAdult)

		expect(screen.getByText("2 adults")).toBeInTheDocument()
	})

	test("user can fill in the pickup address and contact details", async () => {
		await openAraIyeBooking()

		const pickup = screen.getByRole("textbox", { name: "Pick me up from" })
		const firstName = screen.getByRole("textbox", { name: "First name *" })
		const lastName = screen.getByRole("textbox", { name: "Last name *" })
		const email = screen.getByRole("textbox", { name: "Email address *" })
		const phone = screen.getByRole("textbox", { name: "Phone number *" })

		await user.type(pickup, "12 Admiralty Way, Lekki")
		await user.type(firstName, "Ada")
		await user.type(lastName, "Okafor")
		await user.type(email, "ada.okafor@gmail.com")
		await user.type(phone, "08031234567")

		expect(pickup).toHaveValue("12 Admiralty Way, Lekki")
		expect(firstName).toHaveValue("Ada")
		expect(lastName).toHaveValue("Okafor")
		expect(email).toHaveValue("ada.okafor@gmail.com")
		expect(phone).toHaveValue("08031234567")
	})

	test("request stays disabled until the form is valid", async () => {
		await openAraIyeBooking()

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
		const araIye = listingFactory.build()
		const { pickupDate, departureDate } = initialRideDates()
		mockPostUrls(apiClient)
			.url(FahariApiPaths.RIDE_REQUESTS)
			.respond({ id: 1 })
			.apply()
		await openAraIyeBooking()

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
		await user.type(
			screen.getByRole("textbox", { name: "Phone number *" }),
			"08031234567",
		)

		await user.click(screen.getByRole("button", { name: "Request this car" }))

		await waitFor(() => {
			expect(vi.mocked(apiClient.post)).toHaveBeenCalledWith(
				FahariApiPaths.RIDE_REQUESTS,
				{
					experienceCode: araIye.code,
					numberOfPassengers: 1,
					pickupLocation: "12 Admiralty Way, Lekki",
					pickupDateTime: formatRideDateTime(
						pickupDate,
						araIye.schedule.startTime,
					),
					departureDateTime: formatRideDateTime(
						departureDate,
						araIye.schedule.endTime,
					),
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
			screen.getByRole("button", { name: "Request this car" }),
		).toBeDisabled()
	})
})
