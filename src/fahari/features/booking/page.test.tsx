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
import type { ReactNode } from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

const googleMaps = vi.hoisted(() => ({ status: "LOADED" }))

vi.mock("@vis.gl/react-google-maps", () => ({
	APILoadingStatus: { LOADED: "LOADED", AUTH_FAILURE: "AUTH_FAILURE" },
	APIProvider: ({ children }: { children: ReactNode }) => children,
	useApiLoadingStatus: () => googleMaps.status,
	Map: ({ children }: { children: ReactNode }) => children,
	AdvancedMarker: () => null,
}))

type MockedGetUrls = ReturnType<typeof mockGetUrls>

function placePath(placeId: string) {
	return `${FahariApiPaths.PLACES}/${placeId}`
}

// The backend answers suggestions and each suggestion's location.
function pickupSuggestions(addresses: string[]) {
	return (urls: MockedGetUrls) => {
		const suggestions = addresses.map((text, index) => ({
			placeId: `place-${index}`,
			text,
		}))
		urls.url(FahariApiPaths.ADDRESS_SUGGESTIONS).respond(suggestions)
		for (const { placeId } of suggestions) {
			urls
				.url(placePath(placeId))
				.respond({ placeId, latitude: 6.4281, longitude: 3.4219 })
		}
		return urls
	}
}

describe("Fahari booking", () => {
	let user: UserEvent

	beforeEach(() => {
		user = userEvent.setup()
		vi.stubEnv("VITE_GOOGLE_MAPS_API_KEY", "test-maps-key")
		googleMaps.status = "LOADED"
	})

	afterEach(() => {
		vi.unstubAllEnvs()
	})

	async function openBooking(
		client = chauffeurClientFactory.build(),
		amount = client.vehicles[0]?.sameDayPrice ?? "0.00",
		mockMoreUrls = (urls: MockedGetUrls) => urls,
	) {
		await act(async () => {
			mockMoreUrls(
				mockGetUrls()
					.url(FahariApiPaths.CHAUFFEUR_CLIENT)
					.respond(client)
					.url(FahariApiPaths.RIDE_FARE)
					.respond({ amount }),
			).apply()
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

	test("a one-way ride shows only the going leg", async () => {
		const softDays = chauffeurClientFactory.build({
			name: "soft days by Ade x Ede",
			code: "softdays",
			tagLine: "Slow travel for creatives in africa",
			tripType: {
				code: "one_way",
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

		const pickup = screen.getByRole("combobox", { name: "Pick me up from" })
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

	function openBookingWithSuggestions(
		mockMoreUrls: (urls: MockedGetUrls) => MockedGetUrls,
	) {
		const client = chauffeurClientFactory.build()
		return openBooking(client, client.vehicles[0].sameDayPrice, mockMoreUrls)
	}

	async function fillLandmarkAndContactDetails() {
		await user.type(
			screen.getByRole("textbox", { name: "Nearest landmark" }),
			"Opposite Shoprite",
		)
		await fillContact()
	}

	async function expectRideRequestFrom(pickupLocation: string) {
		await user.click(screen.getByRole("button", { name: "Request this car" }))
		await waitFor(() => {
			expect(vi.mocked(apiClient.post)).toHaveBeenCalledWith(
				FahariApiPaths.RIDE_REQUESTS,
				expect.objectContaining({ pickupLocation }),
			)
		})
	}

	test("guest picks a suggested pickup and sees it on the map", async () => {
		await openBookingWithSuggestions(
			pickupSuggestions([
				"Admiralty Way, Lekki, Nigeria",
				"Admiralty Road, Lekki Phase 1, Nigeria",
			]),
		)

		const pickup = screen.getByRole("combobox", { name: "Pick me up from" })
		await user.type(pickup, "Admiralty")
		await user.click(
			await screen.findByRole("option", {
				name: "Admiralty Road, Lekki Phase 1, Nigeria",
			}),
		)

		expect(pickup).toHaveValue("Admiralty Road, Lekki Phase 1, Nigeria")
		expect(
			await screen.findByRole("region", { name: "Pickup on the map" }),
		).toBeInTheDocument()
		expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
	})

	test("the searches and the pick share one session token", async () => {
		await openBookingWithSuggestions(
			pickupSuggestions(["Admiralty Way, Lekki, Nigeria"]),
		)

		await user.type(
			screen.getByRole("combobox", { name: "Pick me up from" }),
			"Admiralty",
		)
		await user.click(
			await screen.findByRole("option", {
				name: "Admiralty Way, Lekki, Nigeria",
			}),
		)
		await screen.findByRole("region", { name: "Pickup on the map" })

		const get = vi.mocked(apiClient.get)
		const search = get.mock.calls.find(
			([url]) => url === FahariApiPaths.ADDRESS_SUGGESTIONS,
		)
		const pick = get.mock.calls.find(([url]) => url === placePath("place-0"))
		const sessionToken = search?.[1]?.params.sessionToken
		expect(search?.[1]?.params).toEqual({ input: "Admiralty", sessionToken })
		expect(sessionToken).toEqual(expect.any(String))
		expect(pick?.[1]?.params).toEqual({ sessionToken })
	})

	test("a picked pickup is sent as the address text only", async () => {
		mockPostUrls(apiClient)
			.url(FahariApiPaths.RIDE_REQUESTS)
			.respond({ id: 1 })
			.apply()
		await openBookingWithSuggestions(
			pickupSuggestions(["Admiralty Way, Lekki, Nigeria"]),
		)

		await user.type(
			screen.getByRole("combobox", { name: "Pick me up from" }),
			"Admiralty",
		)
		await user.click(
			await screen.findByRole("option", {
				name: "Admiralty Way, Lekki, Nigeria",
			}),
		)
		await screen.findByRole("region", { name: "Pickup on the map" })
		await fillLandmarkAndContactDetails()

		await user.click(screen.getByRole("button", { name: "Request this car" }))

		await waitFor(() => {
			expect(vi.mocked(apiClient.post)).toHaveBeenCalled()
		})
		const [, rideRequest] = vi.mocked(apiClient.post).mock.calls[0]
		expect(rideRequest).toMatchObject({
			pickupLocation: "Admiralty Way, Lekki, Nigeria",
		})
		expect(rideRequest).not.toHaveProperty("pickupPlace")
	})

	test("guest can choose a suggestion with the keyboard", async () => {
		await openBookingWithSuggestions(
			pickupSuggestions([
				"Admiralty Way, Lekki, Nigeria",
				"Admiralty Road, Lekki Phase 1, Nigeria",
			]),
		)

		const pickup = screen.getByRole("combobox", { name: "Pick me up from" })
		await user.type(pickup, "Admiralty")
		await screen.findByRole("listbox", { name: "Pickup suggestions" })
		await user.keyboard("{ArrowDown}{ArrowDown}{Enter}")

		expect(pickup).toHaveValue("Admiralty Road, Lekki Phase 1, Nigeria")
		expect(
			await screen.findByRole("region", { name: "Pickup on the map" }),
		).toBeInTheDocument()
	})

	test("pickup becomes a plain field when suggestions are switched off", async () => {
		await openBookingWithSuggestions((urls) =>
			urls
				.url(FahariApiPaths.ADDRESS_SUGGESTIONS)
				.fail(HttpStatusCode.ServiceUnavailable),
		)

		await user.type(
			screen.getByRole("combobox", { name: "Pick me up from" }),
			"12 Admiralty Way, Lekki",
		)

		const pickup = await screen.findByRole("textbox", {
			name: "Pick me up from",
		})
		expect(pickup).toHaveValue("12 Admiralty Way, Lekki")
		expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
	})

	test("suggestions still work without a map when the map is switched off", async () => {
		googleMaps.status = "AUTH_FAILURE"
		await openBookingWithSuggestions(
			pickupSuggestions(["Admiralty Way, Lekki, Nigeria"]),
		)

		const pickup = screen.getByRole("combobox", { name: "Pick me up from" })
		await user.type(pickup, "Admiralty")
		await user.click(
			await screen.findByRole("option", {
				name: "Admiralty Way, Lekki, Nigeria",
			}),
		)

		expect(pickup).toHaveValue("Admiralty Way, Lekki, Nigeria")
		await waitFor(() => {
			expect(vi.mocked(apiClient.get)).toHaveBeenCalledWith(
				placePath("place-0"),
				expect.anything(),
			)
		})
		expect(
			screen.queryByRole("region", { name: "Pickup on the map" }),
		).not.toBeInTheDocument()
	})

	test("ride request still goes through when suggestions are switched off", async () => {
		mockPostUrls(apiClient)
			.url(FahariApiPaths.RIDE_REQUESTS)
			.respond({ id: 1 })
			.apply()
		await openBookingWithSuggestions((urls) =>
			urls
				.url(FahariApiPaths.ADDRESS_SUGGESTIONS)
				.fail(HttpStatusCode.ServiceUnavailable),
		)

		await user.type(
			screen.getByRole("combobox", { name: "Pick me up from" }),
			"12 Admiralty Way, Lekki",
		)
		await screen.findByRole("textbox", { name: "Pick me up from" })
		await fillLandmarkAndContactDetails()

		await expectRideRequestFrom("12 Admiralty Way, Lekki")
	})

	test("ride request still goes through when a guest hits the search limit", async () => {
		mockPostUrls(apiClient)
			.url(FahariApiPaths.RIDE_REQUESTS)
			.respond({ id: 1 })
			.apply()
		await openBookingWithSuggestions((urls) =>
			urls
				.url(FahariApiPaths.ADDRESS_SUGGESTIONS)
				.fail(HttpStatusCode.TooManyRequests),
		)

		await user.type(
			screen.getByRole("combobox", { name: "Pick me up from" }),
			"12 Admiralty Way, Lekki",
		)
		await screen.findByRole("textbox", { name: "Pick me up from" })
		await fillLandmarkAndContactDetails()

		await expectRideRequestFrom("12 Admiralty Way, Lekki")
	})

	test("a picked pickup is still sent when it can't be located for the map", async () => {
		mockPostUrls(apiClient)
			.url(FahariApiPaths.RIDE_REQUESTS)
			.respond({ id: 1 })
			.apply()
		await openBookingWithSuggestions((urls) =>
			pickupSuggestions(["Admiralty Way, Lekki, Nigeria"])(urls)
				.url(placePath("place-0"))
				.fail(HttpStatusCode.ServiceUnavailable),
		)

		await user.type(
			screen.getByRole("combobox", { name: "Pick me up from" }),
			"Admiralty",
		)
		await user.click(
			await screen.findByRole("option", {
				name: "Admiralty Way, Lekki, Nigeria",
			}),
		)
		await fillLandmarkAndContactDetails()

		expect(
			screen.queryByRole("region", { name: "Pickup on the map" }),
		).not.toBeInTheDocument()
		await expectRideRequestFrom("Admiralty Way, Lekki, Nigeria")
	})

	test("request stays disabled until the form is valid", async () => {
		await openBooking()

		const request = screen.getByRole("button", { name: "Request this car" })
		expect(request).toBeDisabled()

		await user.type(
			screen.getByRole("combobox", { name: "Pick me up from" }),
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

	test("a one-way ride request sends pickup only", async () => {
		const softDays = chauffeurClientFactory.build({
			name: "soft days by Ade x Ede",
			code: "softdays",
			tripType: {
				code: "one_way",
				description: "take from home to meetup location",
			},
			fareNote: null,
			meetupPoint: {
				name: "seme border",
				address: "lagos badagry express way",
				nearestLandmark: null,
			},
		})
		const { pickupDate } = initialBookingSchedule(softDays)
		mockPostUrls(apiClient)
			.url(FahariApiPaths.RIDE_REQUESTS)
			.respond({ id: 1 })
			.apply()
		await openBooking(softDays)

		await user.type(
			screen.getByRole("combobox", { name: "Pick me up from" }),
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
					experienceCode: softDays.code,
					numberOfPassengers: 1,
					pickupLocation: "12 Admiralty Way, Lekki",
					nearestLandmark: "Opposite Shoprite",
					pickupDateTime: formatRideDateTime(pickupDate, "15:00"),
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
			screen.getByRole("combobox", { name: "Pick me up from" }),
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
			screen.getByRole("combobox", { name: "Pick me up from" }),
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
