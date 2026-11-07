import { apiClient } from "@common/lib/api-client.ts"
import { mockGetUrls, mockPostUrls } from "@common/test/helpers/mocks.ts"
import { navigateToTestPage } from "@envoye/test/helpers/navigate.tsx"
import { FahariApiPaths } from "@fahari/constants.ts"
import { initialRideDates } from "@fahari/features/booking/components/ride-booking-card.tsx"
import { formatRideDateTime } from "@fahari/features/booking/format.ts"
import { listingFactory } from "@fahari/test/factory/listing.ts"
import { act, screen, waitFor } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { HttpStatusCode } from "axios"
import type { ReactNode } from "react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

const googleMaps = vi.hoisted(() => ({
	places: null as unknown,
	status: "LOADED",
}))

vi.mock("@vis.gl/react-google-maps", () => ({
	APILoadingStatus: { LOADED: "LOADED", AUTH_FAILURE: "AUTH_FAILURE" },
	APIProvider: ({ children }: { children: ReactNode }) => children,
	useMapsLibrary: () => googleMaps.places,
	useApiLoadingStatus: () => googleMaps.status,
	Map: ({ children }: { children: ReactNode }) => children,
	AdvancedMarker: () => null,
}))

function fakePlaces(addresses: string[]) {
	const fetchAutocompleteSuggestions = vi.fn().mockResolvedValue({
		suggestions: addresses.map((address) => ({
			placePrediction: {
				placeId: address,
				text: { text: address },
				toPlace: () => ({
					id: address,
					location: { lat: () => 6.4281, lng: () => 3.4219 },
					fetchFields: vi.fn().mockResolvedValue({}),
				}),
			},
		})),
	})
	return {
		AutocompleteSessionToken: class {},
		AutocompleteSuggestion: { fetchAutocompleteSuggestions },
	}
}

describe("Fahari booking", () => {
	let user: UserEvent

	beforeEach(() => {
		user = userEvent.setup()
		vi.stubEnv("VITE_GOOGLE_MAPS_API_KEY", "test-maps-key")
		googleMaps.places = null
		googleMaps.status = "LOADED"
	})

	afterEach(() => {
		vi.unstubAllEnvs()
	})

	async function openAraIyeBooking(
		overrides: Parameters<typeof listingFactory.build>[0] = {},
	) {
		const araIye = listingFactory.build(overrides)
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
				product: "fahari",
			})
		})
		expect(
			await screen.findByRole("heading", { name: "Make this your ride" }),
		).toBeInTheDocument()
	}

	test("listing names are title-cased in the tab and on the page", async () => {
		await openAraIyeBooking({
			name: "ara iye",
			meetingPoint: { name: "ara iye reception" },
		})

		await waitFor(() => {
			expect(document.title).toBe("Fahari - Ara Iye")
		})
		expect(
			screen.getByText("Private ride to Ara Iye and back"),
		).toBeInTheDocument()
		expect(screen.getByText("Destination: Ara Iye")).toBeInTheDocument()
		expect(screen.getByText("Pickup: Ara Iye Reception")).toBeInTheDocument()
	})

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

	test("guest picks a suggested pickup and sees it on the map", async () => {
		const places = fakePlaces([
			"Admiralty Way, Lekki, Nigeria",
			"Admiralty Road, Lekki Phase 1, Nigeria",
		])
		googleMaps.places = places
		await openAraIyeBooking()

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
		expect(
			places.AutocompleteSuggestion.fetchAutocompleteSuggestions,
		).toHaveBeenCalledWith(
			expect.objectContaining({
				input: "Admiralty",
				includedRegionCodes: ["ng"],
			}),
		)
	})

	test("a picked pickup is sent as the address text only", async () => {
		mockPostUrls(apiClient)
			.url(FahariApiPaths.RIDE_REQUESTS)
			.respond({ id: 1 })
			.apply()
		googleMaps.places = fakePlaces(["Admiralty Way, Lekki, Nigeria"])
		await openAraIyeBooking()

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
		await user.type(
			screen.getByRole("textbox", { name: "Nearest landmark" }),
			"Opposite Shoprite",
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
			expect(vi.mocked(apiClient.post)).toHaveBeenCalled()
		})
		const [, rideRequest] = vi.mocked(apiClient.post).mock.calls[0]
		expect(rideRequest).toMatchObject({
			pickupLocation: "Admiralty Way, Lekki, Nigeria",
		})
		expect(rideRequest).not.toHaveProperty("pickupPlace")
	})

	test("guest can choose a suggestion with the keyboard", async () => {
		googleMaps.places = fakePlaces([
			"Admiralty Way, Lekki, Nigeria",
			"Admiralty Road, Lekki Phase 1, Nigeria",
		])
		await openAraIyeBooking()

		const pickup = screen.getByRole("combobox", { name: "Pick me up from" })
		await user.type(pickup, "Admiralty")
		await screen.findByRole("listbox", { name: "Pickup suggestions" })
		await user.keyboard("{ArrowDown}{ArrowDown}{Enter}")

		expect(pickup).toHaveValue("Admiralty Road, Lekki Phase 1, Nigeria")
		expect(
			await screen.findByRole("region", { name: "Pickup on the map" }),
		).toBeInTheDocument()
	})

	test("guest can still type a pickup when Google refuses suggestions", async () => {
		const places = fakePlaces([])
		places.AutocompleteSuggestion.fetchAutocompleteSuggestions.mockRejectedValue(
			new Error("Places API has been disabled"),
		)
		googleMaps.places = places
		await openAraIyeBooking()

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

	test("pickup is a plain field without a map when Google is switched off", async () => {
		googleMaps.places = fakePlaces(["Admiralty Way, Lekki, Nigeria"])
		googleMaps.status = "AUTH_FAILURE"
		await openAraIyeBooking()

		const pickup = screen.getByRole("textbox", { name: "Pick me up from" })
		await user.type(pickup, "12 Admiralty Way, Lekki")

		expect(pickup).toHaveValue("12 Admiralty Way, Lekki")
		expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
		expect(
			screen.queryByRole("region", { name: "Pickup on the map" }),
		).not.toBeInTheDocument()
	})

	async function fillLandmarkAndContactDetails() {
		await user.type(
			screen.getByRole("textbox", { name: "Nearest landmark" }),
			"Opposite Shoprite",
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

	test("ride request still goes through when Google is switched off", async () => {
		mockPostUrls(apiClient)
			.url(FahariApiPaths.RIDE_REQUESTS)
			.respond({ id: 1 })
			.apply()
		googleMaps.places = fakePlaces(["Admiralty Way, Lekki, Nigeria"])
		googleMaps.status = "AUTH_FAILURE"
		await openAraIyeBooking()

		await user.type(
			screen.getByRole("textbox", { name: "Pick me up from" }),
			"12 Admiralty Way, Lekki",
		)
		await fillLandmarkAndContactDetails()

		await expectRideRequestFrom("12 Admiralty Way, Lekki")
	})

	test("ride request still goes through when Google refuses suggestions mid-search", async () => {
		mockPostUrls(apiClient)
			.url(FahariApiPaths.RIDE_REQUESTS)
			.respond({ id: 1 })
			.apply()
		const places = fakePlaces([])
		places.AutocompleteSuggestion.fetchAutocompleteSuggestions.mockRejectedValue(
			new Error("Places API has been disabled"),
		)
		googleMaps.places = places
		await openAraIyeBooking()

		await user.type(
			screen.getByRole("combobox", { name: "Pick me up from" }),
			"12 Admiralty Way, Lekki",
		)
		await screen.findByRole("textbox", { name: "Pick me up from" })
		await fillLandmarkAndContactDetails()

		await expectRideRequestFrom("12 Admiralty Way, Lekki")
	})

	test("a picked pickup is still sent when Google can't locate it for the map", async () => {
		mockPostUrls(apiClient)
			.url(FahariApiPaths.RIDE_REQUESTS)
			.respond({ id: 1 })
			.apply()
		const places = fakePlaces(["Admiralty Way, Lekki, Nigeria"])
		places.AutocompleteSuggestion.fetchAutocompleteSuggestions.mockResolvedValue(
			{
				suggestions: [
					{
						placePrediction: {
							placeId: "admiralty",
							text: { text: "Admiralty Way, Lekki, Nigeria" },
							toPlace: () => ({
								fetchFields: vi
									.fn()
									.mockRejectedValue(new Error("Places API has been disabled")),
							}),
						},
					},
				],
			},
		)
		googleMaps.places = places
		await openAraIyeBooking()

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

		expect(request).toBeDisabled()

		await user.type(
			screen.getByRole("textbox", { name: "Nearest landmark" }),
			"Opposite Shoprite",
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
			screen.getByRole("textbox", { name: "Nearest landmark" }),
			"Opposite Shoprite",
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
					nearestLandmark: "Opposite Shoprite",
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
		await openAraIyeBooking()

		await user.type(
			screen.getByRole("textbox", { name: "Pick me up from" }),
			"12 Admiralty Way, Lekki",
		)
		await user.type(
			screen.getByRole("textbox", { name: "Nearest landmark" }),
			"Opposite Shoprite",
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

		expect(
			await screen.findByText("Couldn't request this ride"),
		).toBeInTheDocument()
		const email = await screen.findByRole("link", { name: "humans@fahari.io" })
		expect(email).toHaveAttribute("href", "mailto:humans@fahari.io")
		expect(email.closest("[data-sileo-description]")).toHaveTextContent(
			"Please reach out to us at humans@fahari.io",
		)
	})
})
