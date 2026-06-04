import renderWithQueryClient from "@/common/renderWithQueryClient.tsx"
import type { Task } from "@/features/admin/api/list-tasks.ts"
import type { RunTaskSummary } from "@/features/admin/api/run-task.ts"
import AdminBackfillPage from "@/features/admin/features/backfill/page.tsx"
import { adminApiClient } from "@/lib/admin-api-client.ts"
import { mockAuthedUser } from "@/test/helpers/mocks.ts"
import { screen } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

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
		user = userEvent.setup()
		mockAuthedUser()
		mockApiClientGet.mockResolvedValue({ data: [task] })
	})

	async function runJobWith(status: RunTaskSummary) {
		mockApiClientPost.mockResolvedValue({ data: status })
		renderWithQueryClient(<AdminBackfillPage />)
		await screen.findByText(task.name)
		await user.click(screen.getByRole("button", { name: /run job/i }))
	}

	it("renders a success toast when every workspace succeeds", async () => {
		await runJobWith({
			jobId: task.jobId,
			status: "success",
			result: { processed: 12, success: 12, failed: 0 },
		})

		expect(
			await screen.findByText("Backfill completed successfully."),
		).toBeInTheDocument()
	})

	it("renders a warning toast with counts on a partial run", async () => {
		await runJobWith({
			jobId: task.jobId,
			status: "partial",
			result: { processed: 12, success: 9, failed: 3 },
		})

		expect(
			await screen.findByText("Backfill completed with some failures."),
		).toBeInTheDocument()
	})

	it("renders an error toast when every workspace fails", async () => {
		await runJobWith({
			jobId: task.jobId,
			status: "failure",
			result: { processed: 12, success: 0, failed: 12 },
		})

		expect(await screen.findByText("Backfill failed.")).toBeInTheDocument()
	})
})
