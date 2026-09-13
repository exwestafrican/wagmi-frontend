import renderWithQueryClient from "@common/renderWithQueryClient.tsx"
import { AdminAccountsPage } from "@fahari/features/admin/accounts/page.tsx"
import { screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, test } from "vitest"

function getHeaderOpenAccountButton() {
	return within(screen.getByRole("banner")).getByRole("button", {
		name: "Open account",
	})
}

function getEmptyStateOpenAccountButton() {
	return screen.getAllByRole("button", { name: "Open account" })[1]
}

async function expectSheetOpen() {
	const dialog = await screen.findByRole("dialog", { name: "Open account" })
	expect(dialog).toBeVisible()
	expect(
		screen.getByText("Add a driver and create their reserve account."),
	).toBeVisible()
	expect(screen.getByLabelText(/First name/)).toBeInTheDocument()
	expect(screen.getByLabelText(/Last name/)).toBeInTheDocument()
	expect(screen.getByLabelText(/Email/)).toBeInTheDocument()
	expect(screen.getByLabelText(/BVN/)).toBeInTheDocument()
	expect(screen.getByLabelText(/NIN/)).toBeInTheDocument()
	expect(
		within(dialog).getByRole("button", { name: "Open account" }),
	).toBeInTheDocument()
	return dialog
}

describe("Fahari admin accounts", () => {
	test("opens the open account sheet from the header button", async () => {
		const user = userEvent.setup()
		renderWithQueryClient(<AdminAccountsPage />)

		await user.click(getHeaderOpenAccountButton())

		const dialog = await expectSheetOpen()

		await user.click(screen.getByRole("button", { name: "Cancel" }))

		await waitFor(() => {
			expect(dialog).not.toBeInTheDocument()
		})
	})

	test("opens the open account sheet from the empty state", async () => {
		const user = userEvent.setup()
		renderWithQueryClient(<AdminAccountsPage />)

		await user.click(getEmptyStateOpenAccountButton())

		await expectSheetOpen()
	})
})
