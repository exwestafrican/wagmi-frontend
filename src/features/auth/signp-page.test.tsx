import { describe, expect, test } from "vitest"
import type { SignupData } from "@/features/auth/schema/signupSchema.ts"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient.tsx"
import SignupPage from "@/features/auth/signup-page.tsx"
import type { UserEvent } from "@testing-library/user-event"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

describe("Signup page", () => {
	function makeSignupDetails(details: Partial<SignupData>): SignupData {
		return {
			firstName: "John",
			lastName: "Doe",
			workEmail: "james@gmail.com",
			companyName: "sandpaper",
			...details,
		}
	}

	const formFields = {
		firstName: "first-name",
		lastName: "last-name",
		workEmail: "email",
		companyName: "company-name",
		submit: "submit-button",
		workEmailErrorMessage: "email-form-message",
		firstNameErrorMessage: "firstname-form-message",
		lastNameErrorMessage: "lastname-form-message",
		companyNameErrorMessage: "companyname-form-message",
	}

	function setupSignupPage() {
		const queryClient = createTestQueryClient()
		renderWithQueryClient(<SignupPage />, { queryClient })
	}

	function inputHelpers(user: UserEvent) {
		return {
			enterInput: async function enterInput(value: string, inputId: string) {
				const input = screen.getByTestId(inputId)
				await user.type(input, value)
			},
		}
	}

	describe("disable button for invalid input", () => {
		describe("Email", () => {
			test.each(["invalid-email", "tum@c", " "])(
				"should disable submit button",
				async (email) => {
					const user = userEvent.setup()
					const userInput = inputHelpers(user)
					setupSignupPage()

					expect(
						screen.queryByTestId(formFields.workEmailErrorMessage),
					).not.toBeInTheDocument()

					const signupDetails = makeSignupDetails({})
					await userInput.enterInput(
						signupDetails.firstName,
						formFields.firstName,
					)
					await userInput.enterInput(
						signupDetails.lastName,
						formFields.lastName,
					)
					await userInput.enterInput(email, formFields.workEmail)
					await userInput.enterInput(
						signupDetails.companyName,
						formFields.companyName,
					)

					const submitButton = screen.getByTestId(formFields.submit)

					const emailErrorMessage = screen.getByTestId(
						formFields.workEmailErrorMessage,
					)

					await waitFor(() => {
						expect(submitButton).toBeDisabled()
						expect(emailErrorMessage).toBeInTheDocument()
					})
				},
			)
		})

		describe("First name", () => {
			test.each([" ", "f", "firstNameMoreThan!0Characters"])(
				"should disable submit button for invalid first name %s",
				async (firstName) => {
					const user = userEvent.setup()
					const userInput = inputHelpers(user)
					setupSignupPage()
					expect(
						screen.queryByTestId(formFields.firstNameErrorMessage),
					).not.toBeInTheDocument()

					const signupDetails = makeSignupDetails({})

					await userInput.enterInput(firstName, formFields.firstName)
					await userInput.enterInput(
						signupDetails.lastName,
						formFields.lastName,
					)
					await userInput.enterInput(
						signupDetails.workEmail,
						formFields.workEmail,
					)
					await userInput.enterInput(
						signupDetails.companyName,
						formFields.companyName,
					)

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
			test.each([" ", "d", "lastNameMoreThan!0Characters"])(
				"should disable submit button for invalid last name %s",
				async (lastName) => {
					const user = userEvent.setup()
					const userInput = inputHelpers(user)
					setupSignupPage()
					expect(
						screen.queryByTestId(formFields.lastNameErrorMessage),
					).not.toBeInTheDocument()

					const signupDetails = makeSignupDetails({})

					await userInput.enterInput(
						signupDetails.firstName,
						formFields.firstName,
					)
					await userInput.enterInput(lastName, formFields.lastName)
					await userInput.enterInput(
						signupDetails.workEmail,
						formFields.workEmail,
					)
					await userInput.enterInput(
						signupDetails.companyName,
						formFields.companyName,
					)

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
					const user = userEvent.setup()
					const userInput = inputHelpers(user)
					setupSignupPage()
					expect(
						screen.queryByTestId(formFields.companyNameErrorMessage),
					).not.toBeInTheDocument()

					const signupDetails = makeSignupDetails({})

					await userInput.enterInput(
						signupDetails.firstName,
						formFields.firstName,
					)
					await userInput.enterInput(
						signupDetails.lastName,
						formFields.lastName,
					)
					await userInput.enterInput(
						signupDetails.workEmail,
						formFields.workEmail,
					)
					await userInput.enterInput(companyName, formFields.companyName)

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
			const user = userEvent.setup()
			const userInput = inputHelpers(user)
			setupSignupPage()

			const signupDetails = makeSignupDetails({})

			await userInput.enterInput(signupDetails.firstName, formFields.firstName)
			await userInput.enterInput(signupDetails.lastName, formFields.lastName)
			await userInput.enterInput(signupDetails.workEmail, formFields.workEmail)
			await userInput.enterInput(
				signupDetails.companyName,
				formFields.companyName,
			)

			const submitButton = screen.getByTestId(formFields.submit)

			await waitFor(() => {
				expect(submitButton).toBeEnabled()
			})
		})
	})
})
