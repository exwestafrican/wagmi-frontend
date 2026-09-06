import { createAppRouter } from "@/app-router.tsx"
import LanguageProvider from "@common/i18n/LanguageProvider.tsx"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@common/renderWithQueryClient.tsx"
import { useAuthStore } from "@common/stores/auth.store.ts"
import { mockPostUrls } from "@common/test/helpers/mocks.ts"
import { FahariAdminApiPaths, FahariAdminPages } from "@fahari/constants.ts"
import { fahariAdminApiClient } from "@fahari/lib/fahari-admin-api-client.ts"
import { RouterProvider } from "@tanstack/react-router"
import { screen, waitFor } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { HttpStatusCode } from "axios"
import { beforeEach, describe, expect, test, vi } from "vitest"

describe("Fahari admin login", () => {
	let user: UserEvent
	const mockFahariAdminApiClientPost = vi.mocked(fahariAdminApiClient.post)

	beforeEach(() => {
		useAuthStore.getState().clearAuthToken()
	})

	async function setupLoginPage() {
		user = userEvent.setup()
		const queryClient = createTestQueryClient()
		const router = createAppRouter(queryClient)
		await router.navigate({ to: FahariAdminPages.LOGIN })

		renderWithQueryClient(
			<LanguageProvider>
				<RouterProvider router={router} context={{ queryClient }} />
			</LanguageProvider>,
			{ queryClient },
		)
		return { router }
	}

	async function goToCheckEmail(email: string) {
		mockPostUrls(fahariAdminApiClient)
			.url(FahariAdminApiPaths.LOGIN)
			.respond({})
			.apply()

		const { router } = await setupLoginPage()

		await user.type(screen.getByRole("textbox"), email)
		await user.click(screen.getByRole("button", { name: "Send code" }))

		await waitFor(() => {
			expect(router.state.location.pathname).toBe(FahariAdminPages.CHECK_EMAIL)
		})

		return { router }
	}

	test("invalid email keeps the user on login", async () => {
		const { router } = await setupLoginPage()

		expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument()
		expect(screen.getByRole("button", { name: "Send code" })).toBeDisabled()

		await user.type(screen.getByRole("textbox"), "not-an-email")

		expect(screen.getByRole("button", { name: "Send code" })).toBeDisabled()
		expect(router.state.location.pathname).toBe(FahariAdminPages.LOGIN)
		expect(mockFahariAdminApiClientPost).not.toHaveBeenCalled()
	})

	test("valid email calls login endpoint then goes to check-email", async () => {
		const email = "adaeze.okonkwo@fahari.io"
		mockPostUrls(fahariAdminApiClient)
			.url(FahariAdminApiPaths.LOGIN)
			.respond({})
			.apply()

		const { router } = await setupLoginPage()

		await user.type(screen.getByRole("textbox"), email)
		await user.click(screen.getByRole("button", { name: "Send code" }))

		await waitFor(() => {
			expect(mockFahariAdminApiClientPost).toHaveBeenCalledWith(
				FahariAdminApiPaths.LOGIN,
				{ email },
			)
			expect(router.state.location.pathname).toBe(FahariAdminPages.CHECK_EMAIL)
			expect(router.state.location.search).toMatchObject({ email })
		})

		expect(
			screen.getByRole("heading", { name: "Check your email" }),
		).toBeInTheDocument()
		expect(screen.getByText(email, { exact: false })).toBeInTheDocument()
		expect(screen.getByLabelText("Digit 1")).toBeInTheDocument()
		expect(
			screen.getByRole("button", { name: "Verify & sign in" }),
		).toBeInTheDocument()
	})

	test("failed login shows an error and stays on login", async () => {
		const email = "adaeze.okonkwo@fahari.io"
		mockPostUrls(fahariAdminApiClient)
			.url(FahariAdminApiPaths.LOGIN)
			.fail(HttpStatusCode.Unauthorized)
			.apply()

		const { router } = await setupLoginPage()

		await user.type(screen.getByRole("textbox"), email)
		await user.click(screen.getByRole("button", { name: "Send code" }))

		await waitFor(() => {
			expect(mockFahariAdminApiClientPost).toHaveBeenCalledWith(
				FahariAdminApiPaths.LOGIN,
				{ email },
			)
			expect(screen.getAllByText("Unable to login").length).toBeGreaterThan(0)
		})

		expect(router.state.location.pathname).toBe(FahariAdminPages.LOGIN)
	})

	test("back returns to login", async () => {
		const email = "adaeze.okonkwo@fahari.io"
		const { router } = await goToCheckEmail(email)

		await user.click(screen.getByRole("button", { name: "Back" }))

		await waitFor(() => {
			expect(router.state.location.pathname).toBe(FahariAdminPages.LOGIN)
		})

		expect(screen.getByRole("heading", { name: "Sign in" })).toBeInTheDocument()
	})

	test("valid OTP verifies then goes to bookings", async () => {
		const email = "adaeze.okonkwo@fahari.io"
		const otp = "123456"
		const accessToken = "tok_fahari_admin"

		const { router } = await goToCheckEmail(email)

		mockPostUrls(fahariAdminApiClient)
			.url(FahariAdminApiPaths.VERIFY_OTP)
			.respond({ accessToken })
			.apply()

		for (const [index, digit] of [...otp].entries()) {
			await user.type(screen.getByLabelText(`Digit ${index + 1}`), digit)
		}

		await user.click(screen.getByRole("button", { name: "Verify & sign in" }))

		await waitFor(() => {
			expect(mockFahariAdminApiClientPost).toHaveBeenCalledWith(
				FahariAdminApiPaths.VERIFY_OTP,
				{ otp, email },
			)
			expect(router.state.location.pathname).toBe(FahariAdminPages.BOOKINGS)
			expect(router.state.location.hash).toBe(`access_token=${accessToken}`)
		})

		expect(
			screen.getByRole("heading", { name: "Bookings" }),
		).toBeInTheDocument()
		expect(screen.getByRole("link", { name: "Bookings" })).toBeInTheDocument()
		expect(screen.getByText("Admin")).toBeInTheDocument()
		expect(screen.getByText("admin@company.io")).toBeInTheDocument()
	})

	test("invalid OTP shows an error and stays on check-email", async () => {
		const email = "adaeze.okonkwo@fahari.io"
		const otp = "123456"

		const { router } = await goToCheckEmail(email)

		mockPostUrls(fahariAdminApiClient)
			.url(FahariAdminApiPaths.VERIFY_OTP)
			.fail(HttpStatusCode.Unauthorized)
			.apply()

		for (const [index, digit] of [...otp].entries()) {
			await user.type(screen.getByLabelText(`Digit ${index + 1}`), digit)
		}

		await user.click(screen.getByRole("button", { name: "Verify & sign in" }))

		await waitFor(() => {
			expect(mockFahariAdminApiClientPost).toHaveBeenCalledWith(
				FahariAdminApiPaths.VERIFY_OTP,
				{ otp, email },
			)
			expect(screen.getAllByText("Invalid OTP").length).toBeGreaterThan(0)
		})

		expect(router.state.location.pathname).toBe(FahariAdminPages.CHECK_EMAIL)
	})
})
