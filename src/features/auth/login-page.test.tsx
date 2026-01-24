import { beforeEach, describe, expect, vi, test } from "vitest"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import axios from "axios"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient.tsx"
import LoginPage from "@/features/auth/login-page.tsx"
import { screen, waitFor } from "@testing-library/react"

describe("Login page", () => {
	let user: UserEvent
	const mockAxiosPost = vi.mocked(axios.post)

	beforeEach(() => {
		user = userEvent.setup()
	})

	function setupLoginPage() {
		const queryClient = createTestQueryClient()
		renderWithQueryClient(<LoginPage />, { queryClient })
	}

	test("user can login", async () => {
		setupLoginPage()
		const submitButton = screen.getByRole("button")
		expect(submitButton).toBeDisabled()

		const emailInput = screen.getByRole("textbox")
		await user.type(emailInput, "test@example.com")
		expect(emailInput).toHaveValue("test@example.com")

		await user.click(screen.getByRole("button"))

		await waitFor(() => {
			expect(mockAxiosPost).toHaveBeenCalledWith(
				expect.stringContaining("/auth/magic-link/request"),
				{ email: "test@example.com" },
			)
			expect(screen.getByTestId("toaster")).toBeInTheDocument()
			expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
		})
	})
})
