import renderWithQueryClient from "@common/renderWithQueryClient.tsx"
import { mockPostUrls } from "@common/test/helpers/mocks.ts"
import { FahariAdminApiPaths } from "@fahari/constants.ts"
import { AdminAccountsPage } from "@fahari/features/admin/accounts/page.tsx"
import { fahariAdminApiClient } from "@fahari/lib/fahari-admin-api-client.ts"
import { screen, waitFor, within } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { HttpStatusCode } from "axios"
import { describe, expect, test, vi } from "vitest"

const mockFahariAdminApiClientPost = vi.mocked(fahariAdminApiClient.post)

function getHeaderOpenAccountButton() {
	return within(screen.getByRole("banner")).getByRole("button", {
		name: "Open account",
	})
}

function getEmptyStateOpenAccountButton() {
	return screen.getAllByRole("button", { name: "Open account" })[1]
}

function getSheetSubmitButton(dialog: HTMLElement) {
	return within(dialog).getByRole("button", { name: "Open account" })
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
	expect(getSheetSubmitButton(dialog)).toBeInTheDocument()
	return dialog
}

async function fillOpenAccountForm(user: UserEvent) {
	await user.type(screen.getByLabelText(/First name/), "Ada")
	await user.type(screen.getByLabelText(/Last name/), "Okafor")
	await user.type(screen.getByLabelText(/Email/), "Ada@Example.com")
	await user.type(screen.getByLabelText(/BVN/), "21212121212")
	await user.type(screen.getByLabelText(/NIN/), "12034875601")
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

	test("keeps submit disabled until the form is valid", async () => {
		const user = userEvent.setup()
		renderWithQueryClient(<AdminAccountsPage />)

		await user.click(getHeaderOpenAccountButton())
		const dialog = await expectSheetOpen()

		expect(getSheetSubmitButton(dialog)).toBeDisabled()

		await user.type(screen.getByLabelText(/First name/), "Ada")
		await user.type(screen.getByLabelText(/Last name/), "Okafor")
		await user.type(screen.getByLabelText(/Email/), "ada@example.com")
		await user.type(screen.getByLabelText(/BVN/), "2121212121")
		await user.type(screen.getByLabelText(/NIN/), "12034875601")

		expect(getSheetSubmitButton(dialog)).toBeDisabled()
		expect(mockFahariAdminApiClientPost).not.toHaveBeenCalled()
	})

	test("valid submit opens the reserved account then closes the sheet", async () => {
		const user = userEvent.setup()
		mockPostUrls(fahariAdminApiClient)
			.url(FahariAdminApiPaths.RESERVED_ACCOUNT)
			.respond({})
			.apply()

		renderWithQueryClient(<AdminAccountsPage />)

		await user.click(getHeaderOpenAccountButton())
		const dialog = await expectSheetOpen()

		await fillOpenAccountForm(user)
		await user.click(getSheetSubmitButton(dialog))

		await waitFor(() => {
			expect(mockFahariAdminApiClientPost).toHaveBeenCalledWith(
				FahariAdminApiPaths.RESERVED_ACCOUNT,
				{
					firstName: "Ada",
					lastName: "Okafor",
					email: "ada@example.com",
					bvn: "21212121212",
					nin: "12034875601",
				},
			)
			expect(dialog).not.toBeInTheDocument()
		})
	})

	test("failed submit shows an error and keeps the sheet open", async () => {
		const user = userEvent.setup()
		mockPostUrls(fahariAdminApiClient)
			.url(FahariAdminApiPaths.RESERVED_ACCOUNT)
			.fail(HttpStatusCode.BadRequest)
			.apply()

		renderWithQueryClient(<AdminAccountsPage />)

		await user.click(getHeaderOpenAccountButton())
		const dialog = await expectSheetOpen()

		await fillOpenAccountForm(user)
		await user.click(getSheetSubmitButton(dialog))

		await waitFor(() => {
			expect(mockFahariAdminApiClientPost).toHaveBeenCalledWith(
				FahariAdminApiPaths.RESERVED_ACCOUNT,
				{
					firstName: "Ada",
					lastName: "Okafor",
					email: "ada@example.com",
					bvn: "21212121212",
					nin: "12034875601",
				},
			)
			expect(
				screen.getAllByText("Could not open account").length,
			).toBeGreaterThan(0)
		})

		expect(dialog).toBeVisible()
	})
})
