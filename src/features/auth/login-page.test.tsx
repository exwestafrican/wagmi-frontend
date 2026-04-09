import { beforeEach, describe, expect, vi, test } from "vitest"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { HttpStatusCode } from "axios"
import { ApiPaths } from "@/constants"
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
		await setupLoginPage()
		assertSubmitButtonIsDisabled()

		await enterEmail("sam@useenvoye.co")
		const emailInput = screen.getByRole("textbox")
		expect(emailInput).toHaveValue("sam@useenvoye.co")

		await user.click(screen.getByRole("button"))

		await waitFor(() => {
			expect(mockApiClientPost).toHaveBeenCalledWith(
				ApiPaths.MAGIC_LINK_REQUEST,
				{ email: "sam@useenvoye.co" },
			)
			expect(screen.getByTestId("toaster")).toBeInTheDocument()
			expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
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
