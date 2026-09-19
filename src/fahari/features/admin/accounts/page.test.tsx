import renderWithQueryClient from "@common/renderWithQueryClient.tsx"
import { mockGetUrls, mockPostUrls } from "@common/test/helpers/mocks.ts"
import { FahariAdminApiPaths } from "@fahari/constants.ts"
import type { DriverAccount } from "@fahari/features/admin/accounts/api/list-accounts.ts"
import { AdminAccountsPage } from "@fahari/features/admin/accounts/page.tsx"
import { fahariAdminApiClient } from "@fahari/lib/fahari-admin-api-client.ts"
import { driverAccountFactory } from "@fahari/test/factory/driver-account.ts"
import { screen, waitFor, within } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { HttpStatusCode } from "axios"
import { describe, expect, test, vi } from "vitest"

const mockFahariAdminApiClientPost = vi.mocked(fahariAdminApiClient.post)
const mockFahariAdminApiClientGet = vi.mocked(fahariAdminApiClient.get)

function stubAccounts(accounts: DriverAccount[] = []) {
	mockGetUrls({ client: fahariAdminApiClient })
		.url(FahariAdminApiPaths.USERS)
		.respond(accounts)
		.apply()
}

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
		stubAccounts()
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
		stubAccounts()
		renderWithQueryClient(<AdminAccountsPage />)

		await waitFor(() => {
			expect(getEmptyStateOpenAccountButton()).toBeInTheDocument()
		})

		await user.click(getEmptyStateOpenAccountButton())

		await expectSheetOpen()
	})

	test("keeps submit disabled until the form is valid", async () => {
		const user = userEvent.setup()
		stubAccounts()
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
		stubAccounts()
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
		stubAccounts()
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

	test("renders provisioned and unprovisioned accounts from the list", async () => {
		const amaraOsei = driverAccountFactory.build({
			firstName: "Amara",
			lastName: "Osei",
			email: "amara@company.io",
			accountNumber: "FAH1029384",
		})
		const brianKamau = driverAccountFactory.build({
			firstName: "Brian",
			lastName: "Kamau",
			email: "brian@company.io",
			reservedAccountId: null,
			accountNumber: null,
		})
		stubAccounts([amaraOsei, brianKamau])
		renderWithQueryClient(<AdminAccountsPage />)

		await screen.findByText("Amara Osei")
		expect(screen.getByText("Driver")).toBeInTheDocument()
		expect(screen.getByText("Account no.")).toBeInTheDocument()
		expect(screen.getByText("amara@company.io")).toBeInTheDocument()
		expect(screen.getByText("FAH1029384")).toBeInTheDocument()
		expect(screen.getByText("Brian Kamau")).toBeInTheDocument()
		expect(screen.getByText("brian@company.io")).toBeInTheDocument()
		expect(screen.getByText("Provision account")).toBeInTheDocument()
		expect(
			screen.getByRole("button", { name: "Provision account" }),
		).toBeInTheDocument()
	})

	test("shows a spinner while the accounts list is loading", () => {
		mockFahariAdminApiClientGet.mockImplementation(() => new Promise(() => {}))
		renderWithQueryClient(<AdminAccountsPage />)

		expect(screen.getByRole("status", { name: "Loading" })).toBeInTheDocument()
		expect(screen.queryByRole("table")).not.toBeInTheDocument()
	})

	test("empty list still shows the centered Open account CTA", async () => {
		stubAccounts([])
		renderWithQueryClient(<AdminAccountsPage />)

		await waitFor(() => {
			expect(getEmptyStateOpenAccountButton()).toBeInTheDocument()
		})

		expect(screen.queryByRole("table")).not.toBeInTheDocument()
	})

	test("successful submit reloads the accounts list", async () => {
		const user = userEvent.setup()
		stubAccounts()
		mockPostUrls(fahariAdminApiClient)
			.url(FahariAdminApiPaths.RESERVED_ACCOUNT)
			.respond({})
			.apply()

		renderWithQueryClient(<AdminAccountsPage />)

		await waitFor(() => {
			expect(mockFahariAdminApiClientGet).toHaveBeenCalledWith(
				FahariAdminApiPaths.USERS,
			)
		})

		await user.click(getHeaderOpenAccountButton())
		const dialog = await expectSheetOpen()
		await fillOpenAccountForm(user)
		await user.click(getSheetSubmitButton(dialog))

		await waitFor(() => {
			expect(mockFahariAdminApiClientPost).toHaveBeenCalled()
			expect(dialog).not.toBeInTheDocument()
		})

		await waitFor(() => {
			const listFetches = mockFahariAdminApiClientGet.mock.calls.filter(
				([url]) => url === FahariAdminApiPaths.USERS,
			)
			expect(listFetches.length).toBeGreaterThanOrEqual(2)
		})
	})

	test("opens the provision sheet from the list", async () => {
		const user = userEvent.setup()
		const brianKamau = driverAccountFactory.build({
			userId: 12,
			firstName: "Brian",
			lastName: "Kamau",
			email: "brian@company.io",
			reservedAccountId: null,
			accountNumber: null,
		})
		stubAccounts([brianKamau])
		renderWithQueryClient(<AdminAccountsPage />)

		await user.click(
			await screen.findByRole("button", { name: "Provision account" }),
		)

		const dialog = await screen.findByRole("dialog", { name: "Brian Kamau" })
		expect(dialog).toBeVisible()
		expect(
			screen.getByText("Enter verification details to provision."),
		).toBeVisible()
		expect(screen.getByLabelText(/BVN/)).toBeInTheDocument()
		expect(screen.getByLabelText(/NIN/)).toBeInTheDocument()
		expect(
			within(dialog).getByRole("button", { name: "Provision account" }),
		).toBeDisabled()
	})

	test("valid provision submit posts userId, bvn, and nin then reloads the list", async () => {
		const user = userEvent.setup()
		const brianKamau = driverAccountFactory.build({
			userId: 12,
			firstName: "Brian",
			lastName: "Kamau",
			email: "brian@company.io",
			reservedAccountId: null,
			accountNumber: null,
		})
		stubAccounts([brianKamau])
		mockPostUrls(fahariAdminApiClient)
			.url(FahariAdminApiPaths.PROVISION_RESERVED_ACCOUNT)
			.respond({})
			.apply()

		renderWithQueryClient(<AdminAccountsPage />)

		await waitFor(() => {
			expect(mockFahariAdminApiClientGet).toHaveBeenCalledWith(
				FahariAdminApiPaths.USERS,
			)
		})

		await user.click(
			await screen.findByRole("button", { name: "Provision account" }),
		)
		const dialog = await screen.findByRole("dialog", { name: "Brian Kamau" })
		await user.type(screen.getByLabelText(/BVN/), "21212121212")
		await user.type(screen.getByLabelText(/NIN/), "12034875601")
		await user.click(
			within(dialog).getByRole("button", { name: "Provision account" }),
		)

		await waitFor(() => {
			expect(mockFahariAdminApiClientPost).toHaveBeenCalledWith(
				FahariAdminApiPaths.PROVISION_RESERVED_ACCOUNT,
				{
					userId: 12,
					bvn: "21212121212",
					nin: "12034875601",
				},
			)
			expect(dialog).not.toBeInTheDocument()
		})

		await waitFor(() => {
			const listFetches = mockFahariAdminApiClientGet.mock.calls.filter(
				([url]) => url === FahariAdminApiPaths.USERS,
			)
			expect(listFetches.length).toBeGreaterThanOrEqual(2)
		})
	})

	test("failed provision submit shows an error and keeps the sheet open", async () => {
		const user = userEvent.setup()
		const brianKamau = driverAccountFactory.build({
			userId: 12,
			firstName: "Brian",
			lastName: "Kamau",
			email: "brian@company.io",
			reservedAccountId: null,
			accountNumber: null,
		})
		stubAccounts([brianKamau])
		mockPostUrls(fahariAdminApiClient)
			.url(FahariAdminApiPaths.PROVISION_RESERVED_ACCOUNT)
			.fail(HttpStatusCode.BadRequest)
			.apply()

		renderWithQueryClient(<AdminAccountsPage />)

		await user.click(
			await screen.findByRole("button", { name: "Provision account" }),
		)
		const dialog = await screen.findByRole("dialog", { name: "Brian Kamau" })
		await user.type(screen.getByLabelText(/BVN/), "21212121212")
		await user.type(screen.getByLabelText(/NIN/), "12034875601")
		await user.click(
			within(dialog).getByRole("button", { name: "Provision account" }),
		)

		await waitFor(() => {
			expect(mockFahariAdminApiClientPost).toHaveBeenCalledWith(
				FahariAdminApiPaths.PROVISION_RESERVED_ACCOUNT,
				{
					userId: 12,
					bvn: "21212121212",
					nin: "12034875601",
				},
			)
			expect(
				screen.getAllByText("Could not provision account").length,
			).toBeGreaterThan(0)
		})

		expect(dialog).toBeVisible()
	})
})
