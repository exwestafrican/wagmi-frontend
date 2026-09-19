import renderWithQueryClient from "@common/renderWithQueryClient.tsx"
import { AdminAccountsPage } from "@fahari/features/admin/accounts/page.tsx"
import { screen } from "@testing-library/react"
import { describe, expect, test } from "vitest"

describe("Fahari admin accounts", () => {
	test("renders the accounts heading and disabled open account controls", () => {
		renderWithQueryClient(<AdminAccountsPage />)

		expect(
			screen.getByRole("heading", { name: "Accounts" }),
		).toBeInTheDocument()

		const openAccountButtons = screen.getAllByRole("button", {
			name: "Open account",
		})
		expect(openAccountButtons).toHaveLength(2)
		for (const button of openAccountButtons) {
			expect(button).toBeDisabled()
		}
	})
})
