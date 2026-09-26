import renderWithQueryClient from "@common/renderWithQueryClient.tsx"
import { AdminBookingsPage } from "@fahari/features/admin/bookings/page.tsx"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

describe("Fahari admin bookings", () => {
	test("opens the new booking sheet from the header button", async () => {
		const user = userEvent.setup()
		renderWithQueryClient(<AdminBookingsPage />)

		await user.click(screen.getByRole("button", { name: "New booking" }))

		expect(screen.getByRole("dialog", { name: "New booking" })).toBeVisible()
		expect(screen.getByRole("tab", { name: "Use the fleet" })).toHaveAttribute(
			"data-state",
			"active",
		)
		expect(screen.getByPlaceholderText("Search teammate…")).toBeInTheDocument()
		expect(screen.getByLabelText("Date")).toBeInTheDocument()
		expect(screen.getByLabelText("Start time")).toBeInTheDocument()
		expect(screen.getByLabelText("End time")).toBeInTheDocument()
		expect(
			screen.getByPlaceholderText("Any details about this booking…"),
		).toBeInTheDocument()

		await user.click(screen.getByRole("button", { name: "Cancel" }))

		await waitFor(() => {
			expect(
				screen.queryByRole("dialog", { name: "New booking" }),
			).not.toBeInTheDocument()
		})
	})

	test("validates the client pickup location url", async () => {
		const user = userEvent.setup()
		renderWithQueryClient(<AdminBookingsPage />)

		await user.click(screen.getByRole("button", { name: "New booking" }))
		await user.click(screen.getByRole("tab", { name: "Client pickup" }))

		expect(screen.getByRole("tab", { name: "Client pickup" })).toHaveAttribute(
			"data-state",
			"active",
		)
		expect(screen.getByText("Client name")).toBeInTheDocument()
		expect(screen.getByPlaceholderText("First name")).toBeInTheDocument()
		expect(
			screen.getByPlaceholderText("Last name (optional)"),
		).toBeInTheDocument()
		expect(screen.getByLabelText("Client email")).toBeInTheDocument()
		expect(
			screen.getByPlaceholderText("client@example.com"),
		).toBeInTheDocument()
		expect(screen.getByLabelText("Pickup location")).toBeInTheDocument()
		expect(screen.getByLabelText("Location URL")).toBeInTheDocument()
		expect(screen.getByLabelText("Pickup date")).toBeInTheDocument()
		expect(screen.getByLabelText("Pickup time")).toBeInTheDocument()
		expect(
			screen.getByPlaceholderText("Did the client ask for anything specific?"),
		).toBeInTheDocument()

		const chauffeur = screen.getByRole("combobox", { name: "Chauffeur" })
		expect(chauffeur).toBeDisabled()
		expect(chauffeur).toHaveAttribute("aria-expanded", "false")

		const bookPickup = screen.getByRole("button", { name: "Book pickup" })
		expect(bookPickup).toBeDisabled()

		const locationUrl = screen.getByLabelText("Location URL")
		await user.type(locationUrl, "not a url")
		await user.tab()

		expect(await screen.findByText("Enter a valid URL")).toBeVisible()
		expect(bookPickup).toBeDisabled()

		await user.clear(locationUrl)
		await user.type(locationUrl, "https://maps.google.com/maps?q=jkia")

		await waitFor(() => {
			expect(screen.queryByText("Enter a valid URL")).not.toBeInTheDocument()
		})
		expect(bookPickup).toBeDisabled()
	})
})
