import { beforeEach, describe, expect, test, vi } from "vitest"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { AdminApiPaths, ApiPaths, CHECK_MAIL_REASON } from "@/constants"
import { adminApiClient } from "@/lib/admin-api-client"
import { apiClient } from "@/lib/api-client"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient.tsx"
import { screen, waitFor } from "@testing-library/react"
import { makeAuthTestRouter } from "@/test/helpers/navigate.tsx"
import { AdminPages, Pages } from "@/utils/pages.ts"
import { RouterProvider } from "@tanstack/react-router"

describe("Admin login page", () => {
	let user: UserEvent
	const mockAdminApiClientPost = vi.mocked(adminApiClient.post)
	const mockApiClientPost = vi.mocked(apiClient.post)

	beforeEach(() => {
		user = userEvent.setup()
	})

	async function setupAdminLoginPage() {
		const queryClient = createTestQueryClient()
		const router = makeAuthTestRouter()
		await router.navigate({ to: AdminPages.LOGIN })
		renderWithQueryClient(<RouterProvider router={router} />, { queryClient })
		return { router }
	}

	async function enterEmail(email: string) {
		const emailInput = screen.getByRole("textbox")
		await user.type(emailInput, email)
	}

	async function submit() {
		await user.click(screen.getByRole("button", { name: "Login" }))
	}

	test("admin login goes to check-email with admin type and shows otp", async () => {
		const email = "sam@useenvoye.co"
		const { router } = await setupAdminLoginPage()

		await enterEmail(email)
		await submit()

		await waitFor(() => {
			expect(mockAdminApiClientPost).toHaveBeenCalledWith(AdminApiPaths.LOGIN, {
				email,
			})
			expect(router.state.location.pathname).toBe(Pages.CHECK_EMAIL)
			expect(router.state.location.search).toMatchObject({
				email,
				type: CHECK_MAIL_REASON.ADMIN_LOGIN_SUCCESS,
			})
		})

		expect(screen.getByLabelText("Digit 1")).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Verify" })).toBeInTheDocument()
	})

	test("admin otp redirects to admin home", async () => {
		const email = "sam@useenvoye.co"
		const otp = "847291"
		const workspaceCode = "e8r4z7"
		const accessToken = "tok_envoye_sam"

		const { router } = await setupAdminLoginPage()
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
			expect(router.state.location.pathname.replace(/\/$/, "")).toBe(
				AdminPages.HOME.replace(/\/$/, ""),
			)
			expect(router.state.location.search).toMatchObject({
				code: workspaceCode,
			})
			expect(router.state.location.hash).toBe(`access_token=${accessToken}`)
		})
	})
})
