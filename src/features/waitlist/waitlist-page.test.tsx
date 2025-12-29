import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import WaitListPage from "./waitlist-page"
import renderWithQueryClient from "@/common/renderWithQueryClient"
import { screen, waitFor } from "@testing-library/react"

const mockMutate = vi.fn((_, options) => {
	options?.onSuccess()
})
vi.mock("@/features/waitlist/api/useJoinWaitlist", () => ({
	useJoinWaitList: () => ({
		mutate: mockMutate,
		isPending: false,
		isError: false,
		error: null,
	}),
}))

// Mock the Zustand store
const mockJoin = vi.fn()
const mockHasJoined = vi.fn(() => false)

vi.mock("@/features/waitlist/store/useWaitlistStatus", () => ({
	useWaitlistStore: (selector: (state: any) => any) => {
		const state = {
			hasJoined: mockHasJoined(),
			join: mockJoin,
		}
		return selector(state)
	},
}))

describe("WaitListPage", () => {
	beforeEach(() => {
		vi.clearAllMocks()
		mockHasJoined.mockReturnValue(false)
	})

	it("should send send data to server when user joins wait list", async () => {
		const user = userEvent.setup()
		renderWithQueryClient(<WaitListPage />)

		const emailInput = screen.getByTestId("waitlist-email-input")
		await user.type(emailInput, "test@example.com")
		expect((emailInput as HTMLInputElement).value).toBe("test@example.com")

		await user.click(screen.getByTestId("join-button"))

		await waitFor(() => {
			expect((emailInput as HTMLInputElement).value).toBe("")
		})

		expect(mockMutate).toHaveBeenCalledTimes(1)

		await waitFor(() => {
			expect(
				screen.getByText("Congratulations!!! You are on the wait list! 🍾🍾"),
			).toBeInTheDocument()
		})
	})

	it("should display countdown clock after successful form submission", async () => {
		const user = userEvent.setup()
		renderWithQueryClient(<WaitListPage />)
		expect(screen.queryByTestId("countdown-clock")).not.toBeInTheDocument()

		const emailInput = screen.getByTestId("waitlist-email-input")
		await user.type(emailInput, "test@example.com")
		await user.click(screen.getByTestId("join-button"))

		await waitFor(() => {
			expect(mockMutate).toHaveBeenCalledTimes(1)
		})

		// Verify join() is called
		expect(mockJoin).toHaveBeenCalled()
	})

	it("should display countdown clock when form submission is successful", async () => {
		mockHasJoined.mockReturnValue(true)
		renderWithQueryClient(<WaitListPage />)
		expect(screen.getByTestId("countdown-clock")).toBeInTheDocument()
	})
})
