import { vi, it, describe, expect, beforeEach } from "vitest"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient.tsx"
import { screen } from "@testing-library/react"
import { TeammateInviteModal } from "@/features/workspace/invite-teammate"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { enterEmailToInvite } from "@/test/helpers/invite-teammates.tsx"

describe("Invite Teammate", () => {
	let user: UserEvent
	async function setupInviteTeammateModal() {
		const queryClient = createTestQueryClient()
		renderWithQueryClient(
			<TeammateInviteModal open={true} onOpenChange={vi.fn()} />,
			{ queryClient },
		)
	}

	function findSendInviteButton() {
		return screen.getAllByRole("button")[1]
	}

	beforeEach(() => {
		user = userEvent.setup()
	})

	it("disables button when no teammate is invited", async () => {
		await setupInviteTeammateModal()
		const sendInviteButton = findSendInviteButton()

		expect(sendInviteButton).toBeDisabled()
	})

	it("does not display modal description", async () => {
		await setupInviteTeammateModal()
		const description = screen.getByTestId("teammate-invite-dialog-description")

		// Verify it's in the DOM but not visible
		expect(description).toBeInTheDocument()
		expect(description).toHaveClass("sr-only")
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
})
