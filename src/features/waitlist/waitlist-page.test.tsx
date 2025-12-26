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

describe("WaitListPage", () => {
	beforeEach(() => {
		vi.clearAllMocks()
	})

	it("should send send data to server when user joins wait list", async () => {
		const user = userEvent.setup()
		renderWithQueryClient(<WaitListPage />)

		const emailInput = screen.getByPlaceholderText("Enter your email...")
		await user.type(emailInput, "test@example.com")
		expect((emailInput as HTMLInputElement).value).toBe("test@example.com")

		await user.click(screen.getByText("Get Notified"))

		await waitFor(() => {
			expect((emailInput as HTMLInputElement).value).toBe("")
		})

		expect(mockMutate).toHaveBeenCalledTimes(1)
	})
})
