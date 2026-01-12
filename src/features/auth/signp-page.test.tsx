import { describe, expect, test, vi, beforeEach } from "vitest"
import type { SignupData } from "@/features/auth/schema/signupSchema.ts"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient.tsx"
import SignupPage from "@/features/auth/signup-page.tsx"
import type { UserEvent } from "@testing-library/user-event/index"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"

describe("Signup page", () => {
	const userInput = inputHelpers(userEvent)

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
	})
})
