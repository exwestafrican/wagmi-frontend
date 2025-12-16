import { render, waitFor } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"
import SignupPage from "@/features/auth/signup-page"
import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"


describe("SignupPage", () => {
	const Input = {
		FIRST_NAME: "first-name",
		LAST_NAME: "last-name",
		WORK_EMAIL: "work-email",
		COMPANY_NAME: "company-name",
		PHONE_NUMBER: "phone-number",
		SUBMIT_BUTTON: "signup-button",
	}

	const SPACE = " "
	// Mock the Link component at the top level
	vi.mock("@tanstack/react-router", async () => {
		const actual = await vi.importActual("@tanstack/react-router")
		return {
			...actual,
			Link: ({ children, to, ...props }: any) => (
				<a href={to} {...props}>
					{children}
				</a>
			),
		}
	})

	describe("user can not sign up with invalid data", () => {
		test("user cannot use multiple spaces in name fields", async () => {
			render(<SignupPage />)
			const user = userEvent.setup()
			const firstNameInput = screen.getByTestId(Input.FIRST_NAME)
			await user.type(firstNameInput, SPACE + SPACE)
			const submitButton = screen.getByTestId(Input.SUBMIT_BUTTON)
			await user.click(submitButton)
			await waitFor(() => {
				const errorMessage = screen.getByText("First name is required")
				expect(errorMessage).toBeDefined()
				expect(errorMessage.textContent).toBe("First name is required")
			})
		})

		test("must contain at least 2 characters", async () => {
			render(<SignupPage />)
			const user = userEvent.setup()
			const firstNameInput = screen.getByTestId(Input.FIRST_NAME)
			await user.type(firstNameInput, "A")
			const submitButton = screen.getByTestId(Input.SUBMIT_BUTTON)
			await user.click(submitButton)
			await waitFor(() => {
				const errorMessage = screen.getByText(
					"First name must contain at least 2 characters",
				)
				expect(errorMessage).toBeDefined()
				expect(errorMessage.textContent).toBe(
					"First name must contain at least 2 characters",
				)
			})
		})
	})
})
