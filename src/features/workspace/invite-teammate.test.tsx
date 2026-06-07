import { WorkspaceStatus } from "@/features/workspace/interface/workspace.interface.ts"
import { WorkspaceCode } from "@/test/constants.ts"
import { teammateFactory } from "@/test/factory/teammate.ts"
import { enterEmailToInvite } from "@/test/helpers/invite-teammates.tsx"
import { screen, waitFor } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { beforeEach, describe, expect, it } from "vitest"
import { navigateToWorkspacePage } from "@/test/helpers/workspace.ts"

const envoyeWorkspace = {
	code: WorkspaceCode.ENVOYE,
	name: "Envoye",
	status: WorkspaceStatus.ACTIVE,
}

describe("Invite Teammate", () => {
	let user: UserEvent

	async function setupInviteTeammateModal() {
		await navigateToWorkspacePage(envoyeWorkspace, teammateFactory.build())
		const menuTrigger = screen.getByRole("button", { name: /Workspace menu/i }) // MoreVertical trigger
		await user.click(menuTrigger)
		await user.click(screen.getByRole("menuitem", { name: /add teammate/i }))
	}

	function findSendInviteButton() {
		return screen.getByTestId("send-workspace-invite-button")
	}

	beforeEach(() => {
		user = userEvent.setup()
	})

	it("disables button when no teammate is invited", async () => {
		await setupInviteTeammateModal()
		await waitFor(() => {
			const sendInviteButton = findSendInviteButton()

			expect(sendInviteButton).toBeDisabled()
		})
	})

	it("does not display modal description", async () => {
		await setupInviteTeammateModal()
		await waitFor(() => {
			const description = screen.getByTestId(
				"teammate-invite-dialog-description",
			)

			// Verify it's in the DOM but not visible
			expect(description).toBeInTheDocument()
			expect(description).toHaveClass("sr-only")
		})
	})

	it("enable send invite button once valid email is inputed", async () => {
		await setupInviteTeammateModal()
		expect(findSendInviteButton()).toBeDisabled()

		await enterEmailToInvite(user, "tumise@useenvoye.io")

		expect(findSendInviteButton()).toBeEnabled()
	})

	it("does not enable send invite button once invalid email is inputted", async () => {
		await setupInviteTeammateModal()
		expect(findSendInviteButton()).toBeDisabled()

		await enterEmailToInvite(user, "invalid-email")
		expect(findSendInviteButton()).toBeDisabled()
	})

	it("allows user to input multiple emails", async () => {
		await setupInviteTeammateModal()

		await enterEmailToInvite(user, "tumise@useenvoye.io")
		await enterEmailToInvite(user, "teammate@useenvoye.io")

		expect(screen.getByText("tumise@useenvoye.io")).toBeInTheDocument()
		expect(screen.getByText("teammate@useenvoye.io")).toBeInTheDocument()
	})

	it("allows user to remove an email from the list", async () => {
		await setupInviteTeammateModal()
		const user = userEvent.setup()

		await enterEmailToInvite(user, "tumise@useenvoye.io")
		await enterEmailToInvite(user, "teammate@useenvoye.io")

		const removeButton = screen.getByRole("button", {
			name: /remove tumise@useenvoye.io/i,
		})
		await user.click(removeButton)

		expect(screen.queryByText("tumise@useenvoye.io")).not.toBeInTheDocument()
		expect(screen.getByText("teammate@useenvoye.io")).toBeInTheDocument()
	})

	it("disables send invite button when more than maximum teammate emails are present", async () => {
		await setupInviteTeammateModal()

		for (const i of Array.from({ length: 11 }, (_, i) => i)) {
			await enterEmailToInvite(user, `tumise${i + 1}@useenvoye.io`)
		}
		await waitFor(() => {
			expect(findSendInviteButton()).toBeDisabled()
			expect(screen.getByText(/Maximum of 10 emails/i)).toBeInTheDocument()
		})
	})
})
