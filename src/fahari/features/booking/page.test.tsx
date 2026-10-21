import { mockGetUrls } from "@common/test/helpers/mocks.ts"
import { navigateToTestPage } from "@envoye/test/helpers/navigate.tsx"
import { FahariApiPaths } from "@fahari/constants.ts"
import { listingFactory } from "@fahari/test/factory/listing.ts"
import { act, screen } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { beforeEach, describe, expect, test } from "vitest"

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
})
