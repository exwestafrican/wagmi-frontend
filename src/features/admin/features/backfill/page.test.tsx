import renderWithQueryClient from "@/common/renderWithQueryClient.tsx"
import { AdminApiPaths } from "@/constants.ts"
import type { Task } from "@/features/admin/api/list-tasks.ts"
import type { RunTaskSummary } from "@/features/admin/api/run-task.ts"
import AdminBackfillPage from "@/features/admin/features/backfill/page.tsx"
import { adminApiClient } from "@/lib/admin-api-client.ts"
import { mockAuthedUser, mockError } from "@/test/helpers/mocks.ts"
import { screen, waitFor } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { toast } from "sonner"
import { beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("sonner", async (importOriginal) => {
	const actual = await importOriginal<typeof import("sonner")>()
	return {
		...actual,
		toast: {
			success: vi.fn(),
			warning: vi.fn(),
			error: vi.fn(),
		},
	}
})

describe("AdminBackfillPage", () => {
	let user: UserEvent
	const mockApiClientGet = vi.mocked(adminApiClient.get)
	const mockApiClientPost = vi.mocked(adminApiClient.post)

	const task: Task = {
		jobId: "normalize_usernames",
		name: "Backfill Normalize Usernames",
		description: "Removes special characters from username",
	}

	beforeEach(() => {
		vi.clearAllMocks()
		user = userEvent.setup()
		mockAuthedUser()
		mockApiClientGet.mockResolvedValue({ data: [task] })
	})

	async function clickRunJob() {
		await screen.findByText(task.name)
		await user.click(screen.getByRole("button", { name: /open menu/i }))
		await user.click(screen.getByRole("menuitem", { name: /run job/i }))
	}

	it("calls the run endpoint with the job id and shows a success toast", async () => {
		const summary: RunTaskSummary = {
			jobId: task.jobId,
			status: "success",
			workspacesProcessed: 12,
			workspacesSucceeded: 12,
			workspacesFailed: 0,
		}
		mockApiClientPost.mockResolvedValue({ data: summary })

		renderWithQueryClient(<AdminBackfillPage />)
		await clickRunJob()

		await waitFor(() => {
			expect(mockApiClientPost).toHaveBeenCalledWith(
				`${AdminApiPaths.LIST_TASKS}/${task.jobId}/run`,
			)
		})
		expect(toast.success).toHaveBeenCalledWith(
			"Backfill complete — ran on 12 workspaces.",
		)
	})

	it("shows a warning toast with counts on a partial run", async () => {
		const summary: RunTaskSummary = {
			jobId: task.jobId,
			status: "partial",
			workspacesProcessed: 12,
			workspacesSucceeded: 9,
			workspacesFailed: 3,
		}
		mockApiClientPost.mockResolvedValue({ data: summary })

		renderWithQueryClient(<AdminBackfillPage />)
		await clickRunJob()

		await waitFor(() => {
			expect(toast.warning).toHaveBeenCalledWith(
				"Ran on 9 of 12 workspaces, 3 failed.",
			)
		})
	})

	it("shows an error toast when the run request fails", async () => {
		mockApiClientPost.mockRejectedValue(mockError(404))

		renderWithQueryClient(<AdminBackfillPage />)
		await clickRunJob()

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalledWith(
				"That backfill job doesn't exist.",
			)
		})
	})
})
