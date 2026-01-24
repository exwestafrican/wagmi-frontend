import { beforeEach, describe, expect, vi, test } from "vitest"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import axios, { HttpStatusCode } from "axios"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient.tsx"
import LoginPage from "@/features/auth/login-page.tsx"
import { screen, waitFor } from "@testing-library/react"
import { mockError } from "@/test/helpers/mocks.ts"

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

	function assertSubmitButtonIsDisabled() {
		const submitButton = screen.getByRole("button")
		expect(submitButton).toBeDisabled()
	}

	async function enterEmail(email: string) {
		const emailInput = screen.getByRole("textbox")
		await user.type(emailInput, email)
	}

	async function submit() {
		await user.click(screen.getByRole("button"))
	}

	test("user can login", async () => {
		setupLoginPage()
		assertSubmitButtonIsDisabled()

		await enterEmail("sam@useenvoye.co")
		const emailInput = screen.getByRole("textbox")
		expect(emailInput).toHaveValue("sam@useenvoye.co")

		await user.click(screen.getByRole("button"))

		await waitFor(() => {
			expect(mockAxiosPost).toHaveBeenCalledWith(
				expect.stringContaining("/auth/magic-link/request"),
				{ email: "sam@useenvoye.co" },
			)
			expect(screen.getByTestId("toaster")).toBeInTheDocument()
			expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
		})
	})

	test("unauthorized user cannot login", async () => {
		mockAxiosPost.mockRejectedValueOnce(mockError(HttpStatusCode.Unauthorized))

		setupLoginPage()
		assertSubmitButtonIsDisabled()

		await enterEmail("sam@useenvoye.co")

		await submit()

		const emailInput = screen.getByRole("textbox")

		await waitFor(() => {
			expect(emailInput).toBeInTheDocument()
			expect(emailInput).toHaveValue("")
		})
	})
})
