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
		expect(
			screen.getByPlaceholderText("Search teammate..."),
		).toBeInTheDocument()
		expect(screen.getByLabelText("Date")).toBeInTheDocument()
		expect(screen.getByLabelText("Start time")).toBeInTheDocument()
		expect(screen.getByLabelText("End time")).toBeInTheDocument()
		expect(
			screen.getByPlaceholderText("Any details about this booking..."),
		).toBeInTheDocument()

		await user.click(screen.getByRole("button", { name: "Cancel" }))

		await waitFor(() => {
			expect(
				screen.queryByRole("dialog", { name: "New booking" }),
			).not.toBeInTheDocument()
		})
	})
})
