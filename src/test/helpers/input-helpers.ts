import type { UserEvent } from "@testing-library/user-event"
import { screen } from "@testing-library/react"
import type { SignupData } from "@/features/auth/schema/signupSchema.ts"

export const formFields = {
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

export function makeSignupDetails(details: Partial<SignupData>): SignupData {
	return {
		firstName: "John",
		lastName: "Doe",
		email: "james@gmail.com",
		companyName: "sandpaper",
		...details,
	}
}

export function inputHelpers(user: UserEvent) {
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
			await user.click(button)
		},
	}
}
