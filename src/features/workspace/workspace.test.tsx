import { describe, expect, vi, test, beforeEach } from "vitest"
import { navigateToTestPage } from "@/test/helpers/navigate"
import { WorkspaceCode } from "@/test/constants.ts"
import { screen, waitFor } from "@testing-library/react"
import { useAuthStore } from "@/stores/auth.store.ts"
import { apiClient } from "@/lib/api-client.ts"
import type { UserEvent } from "@testing-library/user-event"
import userEvent from "@testing-library/user-event"
import { enterEmailToInvite } from "@/test/helpers/invite-teammates.tsx"
import {
	type Workspace,
	WorkspaceStatus,
} from "@/features/workspace/interface/workspace.interface.ts"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import { ApiPaths } from "@/constants.ts"
import { teammateFactory } from "@/test/factory/teammate.ts"

const envoyeWorkspace = {
	code: WorkspaceCode.ENVOYE,
	name: "Envoye",
	status: WorkspaceStatus.ACTIVE,
}

function mockWorkspaceAndCurrentTeammate(
	workspace: Workspace,
	teammate: Teammate = teammateFactory.build(),
) {
	vi.mocked(apiClient.get).mockImplementation((url: string) => {
		if (url === ApiPaths.WORKSPACE) {
			return Promise.resolve({ data: workspace })
		}
		if (url === ApiPaths.CURRENT_TEAMMATE) {
			return Promise.resolve({ data: teammate })
		}
		return Promise.reject(new Error(`Unexpected GET ${url}`))
	})
}

describe("Workspace Test", () => {
	let user: UserEvent

	beforeEach(async () => {
		user = userEvent.setup()
	})

	async function navigateToWorkspacePage(
		workspace: Workspace,
		teammate: Teammate = teammateFactory.build(),
	) {
		useAuthStore.getState().setAuthToken("fake-token")
		mockWorkspaceAndCurrentTeammate(workspace, teammate)
		return await navigateToTestPage({
			to: "/workspace",
			search: { code: workspace.code },
		})
	}

	async function openInviteTeammateModal() {
		const menuTrigger = screen.getByRole("button") // MoreVertical trigger
		await user.click(menuTrigger)
		await user.click(screen.getByRole("menuitem", { name: /add teammate/i }))
	}

	test("renders current teammate email in sidebar", async () => {
		const sidebarEmail = "sidebar.user@useenvoye.com"
		await navigateToWorkspacePage(
			envoyeWorkspace,
			teammateFactory.build({ email: sidebarEmail }),
		)
		expect(await screen.findByText(sidebarEmail)).toBeInTheDocument()
		expect(apiClient.get).toHaveBeenCalledWith(
			ApiPaths.CURRENT_TEAMMATE,
			expect.objectContaining({
				params: { workspaceCode: envoyeWorkspace.code },
			}),
		)
	})

	describe("workspace invite", () => {
		test("on click cancel we close modal and clear all emails typed in by user", async () => {
			await waitFor(() => {
				navigateToWorkspacePage(envoyeWorkspace)
			})
			await openInviteTeammateModal()
			expect(screen.getByRole("dialog")).toBeInTheDocument()
			await enterEmailToInvite(user, "tumise@useenvoye.io")
			expect(screen.getByText("tumise@useenvoye.io")).toBeInTheDocument()

			await user.click(screen.getByRole("button", { name: /cancel/i }))
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

			await openInviteTeammateModal()
			await waitFor(() => {
				expect(
					screen.queryByText("tumise@useenvoye.io"),
				).not.toBeInTheDocument()
			})
		})

		test("on click X button we clear all emails and close modal", async () => {
			await waitFor(() => {
				navigateToWorkspacePage(envoyeWorkspace)
			})
			await openInviteTeammateModal()

			expect(screen.getByRole("dialog")).toBeInTheDocument()

			await enterEmailToInvite(user, "tumise@useenvoye.io")
			expect(screen.getByText("tumise@useenvoye.io")).toBeInTheDocument()

			const closeButton = screen.getByRole("button", { name: /close/i })
			await user.click(closeButton)
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

			await openInviteTeammateModal()

			await waitFor(() => {
				expect(
					screen.queryByText("tumise@useenvoye.io"),
				).not.toBeInTheDocument()
			})
		})
	})

	test("on Escape key we close modal and clear emails", async () => {
		await waitFor(() => {
			navigateToWorkspacePage(envoyeWorkspace)
		})
		await openInviteTeammateModal()

		expect(screen.getByRole("dialog")).toBeInTheDocument()

		await enterEmailToInvite(user, "tumise@useenvoye.io")
		expect(screen.getByText("tumise@useenvoye.io")).toBeInTheDocument()

		await user.keyboard("{Escape}")

		await waitFor(() => {
			expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
		})

		await openInviteTeammateModal()

		await waitFor(() => {
			expect(screen.queryByText("tumise@useenvoye.io")).not.toBeInTheDocument()
		})
	})
})
