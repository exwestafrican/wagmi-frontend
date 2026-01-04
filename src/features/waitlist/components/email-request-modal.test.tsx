import { describe, it, expect, vi, beforeEach } from "vitest"

import { screen, waitFor } from "@testing-library/react"
import renderWithQueryClient from "@/common/renderWithQueryClient"
import { EmailRequestModal } from "@/features/waitlist/components/email-request-modal"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import axios from "axios"

vi.mock("axios")

describe("EmailRequestModal", () => {
	const mockOnSubmitEmailRequest = vi.fn()
	const mockOnOpenChange = vi.fn()
	const mockAxiosGet = vi.mocked(axios.get)

	const defaultProps = {
		open: true,
		onOpenChange: mockOnOpenChange,
		onSubmitEmailRequest: mockOnSubmitEmailRequest,
	}

	async function enterEmail(user: UserEvent, email: string) {
		const emailInput = screen.getByTestId("email-request-input")
		await user.type(emailInput, email)
	}

	async function submitEmail(user: UserEvent) {
		const submitButton = screen.getByTestId("email-request-submit-button")
		await user.click(submitButton)
	}

	beforeEach(() => {
		vi.clearAllMocks()
		mockAxiosGet.mockResolvedValue({
			data: {
				featureIds: [],
			},
		})
	})

	it("should trigger user votes fetch on submit", async () => {
		const email = "test@example.com"
		const user = userEvent.setup()
		const mockUserVotesResponse = {
			data: {
				featureIds: [
					"4956f575-85a8-40ef-afe3-7f5af91a2d46",
					"573aec81-2a22-425a-867c-2082ec266759",
				],
			},
		}
		mockAxiosGet.mockResolvedValue(mockUserVotesResponse)

		renderWithQueryClient(<EmailRequestModal {...defaultProps} />)

		await enterEmail(user, email)
		await submitEmail(user)

		await waitFor(() => {
			expect(mockAxiosGet).toHaveBeenCalled()
		})

		expect(mockAxiosGet).toHaveBeenCalledWith(
			expect.stringContaining("/roadmap/user-votes"),
			{ params: { email: email } },
		)
	})

	it("should disable submit button when email input is empty", async () => {
		renderWithQueryClient(<EmailRequestModal {...defaultProps} />)
		const submitButton = screen.getByTestId("email-request-submit-button")
		expect(submitButton).toBeDisabled()
	})

	it("should not get user votes when email input is empty", async () => {
		renderWithQueryClient(<EmailRequestModal {...defaultProps} />)
		expect(mockAxiosGet).not.toHaveBeenCalled()
	})
})
