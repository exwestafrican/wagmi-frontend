import { beforeEach, describe, expect, test, vi } from "vitest"
import type { SignupData } from "@/features/auth/schema/signupSchema.ts"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient.tsx"
import type { UserEvent } from "@testing-library/user-event"
import userEvent from "@testing-library/user-event"
import { screen, waitFor } from "@testing-library/react"
import { HttpStatusCode } from "axios"
import { RouterProvider } from "@tanstack/react-router"
import { apiClient } from "@/lib/api-client"
import { Pages } from "@/utils/pages.ts"
import { mockError } from "@/test/helpers/mocks.ts"
import { makeAuthTestRouter } from "@/test/helpers/navigate"
import { ApiPaths, CHECK_MAIL_REASON } from "@/constants.ts"

describe("Signup page", () => {
	let user: UserEvent
	let userInput: ReturnType<typeof inputHelpers>
	const mockApiClientPost = vi.mocked(apiClient.post)

	function makeSignupDetails(details: Partial<SignupData>): SignupData {
		return {
			firstName: "John",
			lastName: "Doe",
			email: "james@gmail.com",
			companyName: "sandpaper",
			...details,
		}
	}

	const formFields = {
		firstName: "first-name",
		lastName: "last-name",
		email: "email",
		companyName: "company-name",
		submit: "submit-button",
		emailErrorMessage: "email-form-message",
		firstNameErrorMessage: "firstname-form-message",
		lastNameErrorMessage: "lastname-form-message",
		companyNameErrorMessage: "companyname-form-message",
	}

	async function setupSignupPage() {
		const queryClient = createTestQueryClient()
		const router = makeAuthTestRouter()
		await router.navigate({ to: Pages.SIGNUP })
		renderWithQueryClient(<RouterProvider router={router} />, { queryClient })
		return { router }
	}

	function inputHelpers(user: UserEvent) {
		return {
			enterInput: async function enterInput(value: string, inputId: string) {
				const input = screen.getByTestId(inputId)
				await user.type(input, value)
				await user.tab()
			},
			enterSignUpDetails: async function (details: Partial<SignupData>) {
				const signupDetails = makeSignupDetails(details)
				await this.enterInput(signupDetails.firstName, formFields.firstName)
				await this.enterInput(signupDetails.lastName, formFields.lastName)
				await this.enterInput(signupDetails.email, formFields.email)
				await this.enterInput(signupDetails.companyName, formFields.companyName)
			},
			click: async (button: HTMLElement) => {
				await userEvent.click(button)
			},
		}
	}

	beforeEach(() => {
		user = userEvent.setup()
		userInput = inputHelpers(user)
	})

	describe("disable button for invalid input", () => {
		describe("Email", () => {
			test.each(["invalid-email", "tum@c", " "])(
				"should disable submit button for email %s",
				async (email) => {
					await setupSignupPage()

					expect(
						screen.queryByTestId(formFields.emailErrorMessage),
					).not.toBeInTheDocument()

					await userInput.enterSignUpDetails({
						email,
					})

					const submitButton = screen.getByTestId(formFields.submit)

					const emailErrorMessage = screen.getByTestId(
						formFields.emailErrorMessage,
					)

					await waitFor(() => {
						expect(submitButton).toBeDisabled()
						expect(emailErrorMessage).toBeInTheDocument()
					})
				},
			)
		})

		describe("First name", () => {
			test.each([" ", "f", "d".repeat(19), "firstNameMoreThan!0Characters"])(
				"should disable submit button for invalid first name %s",
				async (firstName) => {
					await setupSignupPage()
					expect(
						screen.queryByTestId(formFields.firstNameErrorMessage),
					).not.toBeInTheDocument()

					await userInput.enterSignUpDetails({
						firstName,
					})

					const submitButton = screen.getByTestId(formFields.submit)

					await waitFor(() => {
						expect(submitButton).toBeDisabled()
						expect(
							screen.getByTestId(formFields.firstNameErrorMessage),
						).toBeInTheDocument()
					})
				},
			)
		})

		describe("Last name", () => {
			test.each([" ", "d", "d".repeat(19), "lastNameMoreThan!0Characters"])(
				"should disable submit button for invalid last name %s",
				async (lastName) => {
					await setupSignupPage()
					expect(
						screen.queryByTestId(formFields.lastNameErrorMessage),
					).not.toBeInTheDocument()

					await userInput.enterSignUpDetails({
						lastName,
					})

					const submitButton = screen.getByTestId(formFields.submit)

					await waitFor(() => {
						expect(submitButton).toBeDisabled()
						expect(
							screen.getByTestId(formFields.lastNameErrorMessage),
						).toBeInTheDocument()
					})
				},
			)
		})

		describe("Company name", () => {
			test.each([" ", "A".repeat(51)])(
				"should disable submit button for invalid company name %s",
				async (companyName) => {
					await setupSignupPage()
					expect(
						screen.queryByTestId(formFields.companyNameErrorMessage),
					).not.toBeInTheDocument()

					await userInput.enterSignUpDetails({
						companyName,
					})

					const submitButton = screen.getByTestId(formFields.submit)

					await waitFor(() => {
						expect(submitButton).toBeDisabled()
						expect(
							screen.getByTestId(formFields.companyNameErrorMessage),
						).toBeInTheDocument()
					})
				},
			)
		})
	})

	describe("valid input", () => {
		test("button is enabled when input is valid", async () => {
			await setupSignupPage()

			await userInput.enterSignUpDetails({})

			const submitButton = screen.getByTestId(formFields.submit)

			await waitFor(() => {
				expect(submitButton).toBeEnabled()
			})
		})

		test("successful signup navigates to check email page", async () => {
			mockApiClientPost.mockResolvedValueOnce({} as never)

			const queryClient = createTestQueryClient()
			const router = makeAuthTestRouter()
			const navigateSpy = vi.spyOn(router, "navigate")
			await router.navigate({ to: Pages.SIGNUP })
			renderWithQueryClient(<RouterProvider router={router} />, { queryClient })

			const signupDetails = makeSignupDetails({
				firstName: "john",
				lastName: "doe",
			})
			await userInput.enterSignUpDetails(signupDetails)

			const submitButton = screen.getByTestId(formFields.submit)
			await userInput.click(submitButton)

			await waitFor(() => {
				expect(mockApiClientPost).toHaveBeenCalledWith(
					ApiPaths.SIGNUP_EMAIL_ONLY,
					{
						...signupDetails,
						timezone: expect.any(String),
					},
				)

				expect(navigateSpy).toHaveBeenCalledWith(
					expect.objectContaining({
						to: Pages.CHECK_EMAIL,
						search: {
							email: signupDetails.email,
							type: CHECK_MAIL_REASON.SIGNUP_SUCCESS,
						},
					}),
				)
			})
		})

		describe("unsuccessful signup", () => {
			beforeEach(async () => {
				mockApiClientPost.mockRejectedValueOnce(
					mockError(HttpStatusCode.Unauthorized),
				)
			})
			test("when user is unauthorized we transition to waitlist page", async () => {
				const queryClient = createTestQueryClient()
				const router = makeAuthTestRouter()
				const navigateSpy = vi.spyOn(router, "navigate")
				await router.navigate({ to: Pages.SIGNUP })
				renderWithQueryClient(<RouterProvider router={router} />, {
					queryClient,
				})

				await userInput.enterSignUpDetails({})

				const submitButton = screen.getByTestId(formFields.submit)
				await userInput.click(submitButton)

				await waitFor(() => {
					expect(navigateSpy).toHaveBeenCalledWith(
						expect.objectContaining({ to: Pages.WAITLIST }),
					)
				})
			})
		})
	})
})
