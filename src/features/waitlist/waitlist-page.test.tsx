import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"
import WaitListPage from "@/features/waitlist/waitlist-page"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient"
import { screen, waitFor } from "@testing-library/react"
import { RoadmapFeatureStage } from "@/features/waitlist/enums/roadmap-feautre-stage"
import { ROADMAP_FEATURES } from "./api/useRoadmapFeatures"

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
	useWaitlistStore: (
		selector: (state: { hasJoined: boolean; join: () => void }) =>
			| boolean
			| (() => void),
	) => {
		const state = {
			hasJoined: mockHasJoined(),
			join: mockJoin,
		}
		return selector(state)
	},
}))

describe("WaitListPage", () => {
	beforeEach(() => {
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

	describe("Planned features", () => {
		it("should display planned features", async () => {
			const mockData = {
				data: [
					{
						id: "1",
						name: "receive Gmail emails in your inbox",
						votes: 10,
						icon: "mail",
						stage: RoadmapFeatureStage.PLANNED,
					},
					{
						id: "2",
						name: "send and receive images in chat",
						votes: 5,
						icon: "image",
						stage: RoadmapFeatureStage.PLANNED,
					},
				],
			}
			const queryClient = createTestQueryClient()

			queryClient.setQueryData([ROADMAP_FEATURES], mockData)

			renderWithQueryClient(<WaitListPage />, {
				queryClient,
			})

			await waitFor(() => {
				expect(screen.getByTestId("planned-feature-1")).toBeInTheDocument()
			})

			const allFeatures = screen.queryAllByTestId(/^planned-feature-/)
			expect(allFeatures).toHaveLength(2)
		})
	})

	describe("Upcoming features", () => {
		it("should display upcoming features", async () => {
			const mockData = {
				data: [
					{
						id: "1",
						name: "receive Gmail emails in your inbox",
						votes: 10,
						icon: "mail",
						stage: RoadmapFeatureStage.IN_PROGRESS,
					},
				],
			}
			const queryClient = createTestQueryClient()

			queryClient.setQueryData([ROADMAP_FEATURES], mockData)

			renderWithQueryClient(<WaitListPage />, {
				queryClient,
			})

			await waitFor(() => {
				expect(screen.getByTestId("upcoming-feature-1")).toBeInTheDocument()
			})

			const allFeatures = screen.queryAllByTestId(/^upcoming-feature-/)
			expect(allFeatures).toHaveLength(1)
		})
	})
})
