import { beforeEach, describe, expect, vi, test } from "vitest"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { HttpStatusCode } from "axios"
import { ApiPaths, CHECK_MAIL_REASON } from "@/constants"
import { apiClient } from "@/lib/api-client"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient.tsx"
import { screen, waitFor } from "@testing-library/react"
import { mockError } from "@/test/helpers/mocks.ts"
import { makeAuthTestRouter } from "@/test/helpers/navigate.tsx"
import { Pages } from "@/utils/pages.ts"
import { RouterProvider } from "@tanstack/react-router"

describe("Login page", () => {
	let user: UserEvent
	const mockApiClientPost = vi.mocked(apiClient.post)

	beforeEach(() => {
		user = userEvent.setup()
	})

	async function setupLoginPage() {
		const queryClient = createTestQueryClient()
		const router = makeAuthTestRouter()
		await router.navigate({ to: Pages.LOGIN })
		renderWithQueryClient(<RouterProvider router={router} />, { queryClient })
		return { router }
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
		const { router } = await setupLoginPage()
		assertSubmitButtonIsDisabled()

		await enterEmail("sam@useenvoye.co")
		const emailInput = screen.getByRole("textbox")
		expect(emailInput).toHaveValue("sam@useenvoye.co")

		await submit()

		await waitFor(() => {
			expect(mockApiClientPost).toHaveBeenCalledWith(
				ApiPaths.MAGIC_LINK_REQUEST,
				{ email: "sam@useenvoye.co" },
			)
			expect(router.state.location.pathname).toBe(Pages.CHECK_EMAIL)
			expect(router.state.location.search).toMatchObject({
				email: "sam@useenvoye.co",
				type: CHECK_MAIL_REASON.LOGIN_SUCCESS,
			})
		})
	})

	test("user can enter otp and verify", async () => {
		const email = "sam@useenvoye.co"
		const otp = "847291"
		const workspaceCode = "e8r4z7"
		const accessToken = "tok_envoye_sam"

		const { router } = await setupLoginPage()
		await enterEmail(email)
		await submit()

		await waitFor(() => {
			expect(router.state.location.pathname).toBe(Pages.CHECK_EMAIL)
		})

		mockApiClientPost.mockResolvedValueOnce({
			data: { workspaceCode, accessToken },
		})

		for (const [index, digit] of [...otp].entries()) {
			await user.type(screen.getByLabelText(`Digit ${index + 1}`), digit)
		}

		await user.click(screen.getByRole("button", { name: "Verify" }))

		await waitFor(() => {
			expect(mockApiClientPost).toHaveBeenCalledWith(ApiPaths.VERIFY_OTP, {
				otp,
				email,
			})
			expect(router.state.location.pathname).toBe(Pages.SETUP_WORKSPACE)
			expect(router.state.location.search).toMatchObject({
				code: workspaceCode,
			})
			expect(router.state.location.hash).toBe(`access_token=${accessToken}`)
		})
	})

	test("unauthorized user cannot login", async () => {
		mockApiClientPost.mockRejectedValueOnce(
			mockError(HttpStatusCode.Unauthorized),
		)

		await setupLoginPage()
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
