import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient.tsx"
import { ApiPaths, CHECK_MAIL_REASON } from "@/constants"
import { apiClient } from "@/lib/api-client"
import { useAuthStore } from "@/stores/auth.store.ts"
import { mockError } from "@/test/helpers/mocks.ts"
import { makeAuthTestRouter } from "@/test/helpers/navigate.tsx"
import { Pages } from "@/utils/pages.ts"
import { RouterProvider } from "@tanstack/react-router"
import { screen, waitFor } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { HttpStatusCode } from "axios"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { useAuthStore } from "@/stores/auth.store.ts"
import { mockWorkspaceAndCurrentTeammate } from "@/test/helpers/workspace.ts"
import { teammateFactory } from "@/test/factory/teammate.ts"
import { WorkspaceStatus } from "@/features/workspace/interface/workspace.interface.ts"

describe("Login page", () => {
	let user: UserEvent
	const mockApiClientPost = vi.mocked(apiClient.post)

	beforeEach(() => {
		user = userEvent.setup()
		useAuthStore.getState().clearAuthToken()
	})

	async function setupLoginPage(search?: { redirect: string }) {
		const queryClient = createTestQueryClient()
		const router = makeAuthTestRouter(queryClient)
		await router.navigate({ to: Pages.LOGIN, search })
		renderWithQueryClient(
			<RouterProvider router={router} context={{ queryClient }} />,
			{ queryClient },
		)
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

	test("user is redirected to conversation after successful OTP verification", async () => {
		const email = "sam@useenvoye.co"
		const otp = "847291"
		const workspaceCode = "e8r4z7"
		const accessToken = "tok_envoye_sam"
		const conversationId = 14
		const redirect = `/workspace/conversation?code=${workspaceCode}&conversationId=${conversationId}`
		const teammate = teammateFactory.build()

		mockWorkspaceAndCurrentTeammate(
			{
				code: workspaceCode,
				name: "Envoye",
				status: WorkspaceStatus.ACTIVE,
			},
			teammate,
		)

		const { router } = await setupLoginPage({ redirect })

		await enterEmail(email)
		await submit()

		await waitFor(() => {
			expect(router.state.location.pathname).toBe(Pages.CHECK_EMAIL)
			expect(router.state.location.search).toMatchObject({ redirect })
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
			expect(router.state.location.pathname).toBe("/workspace/conversation")
			expect(router.state.location.search).toMatchObject({
				code: workspaceCode,
				conversationId: conversationId,
			})

			expect(screen.getByLabelText("message-composer")).toBeInTheDocument()
		})
	})

	test("user is redirected back to their workspace (preserving workspace code and conversation ID) after re-login", async () => {
		const email = "sam@useenvoye.co"
		const otp = "847291"
		const workspaceCode = "e8r4z7"
		const accessToken = "tok_envoye_sam"
		// Mirrors what the 401 response interceptor stores(see create-api-client.ts): the full absolute href.
		const redirect = `${window.location.origin}/workspace/conversation?code=${workspaceCode}&conversationId=1`
		const { router } = await setupLoginPage({ redirect })

		await enterEmail(email)
		await submit()

		await waitFor(() => {
			expect(router.state.location.pathname).toBe(Pages.CHECK_EMAIL)
			expect(router.state.location.search).toMatchObject({ redirect })
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
			expect(router.state.location.pathname).toBe("/workspace/conversation")
			expect(router.state.location.search).toMatchObject({
				code: workspaceCode,
			})
			expect(router.state.location.hash).toBe(`access_token=${accessToken}`)
			expect(screen.getByTestId("conversation-route")).toBeInTheDocument()
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
