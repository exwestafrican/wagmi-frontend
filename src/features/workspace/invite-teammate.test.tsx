import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient.tsx"
import { ApiPaths } from "@/constants.ts"
import { WorkspaceStatus } from "@/features/workspace/interface/workspace.interface.ts"
import LanguageProvider from "@/i18n/LanguageProvider"
import { apiClient } from "@/lib/api-client.ts"
import { useAuthStore } from "@/stores/auth.store.ts"
import { WorkspaceCode } from "@/test/constants.ts"
import { teammateFactory } from "@/test/factory/teammate.ts"
import { enterEmailToInvite } from "@/test/helpers/invite-teammates.tsx"
import { makeTestRouter } from "@/test/helpers/navigate.tsx"
import { RouterProvider } from "@tanstack/react-router"
import { screen, waitFor } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

const envoyeWorkspace = {
	code: WorkspaceCode.ENVOYE,
	name: "Envoye",
	status: WorkspaceStatus.ACTIVE,
}

describe("Invite Teammate", () => {
	let user: UserEvent

	async function setupInviteTeammateModal() {
		const queryClient = createTestQueryClient()
		const router = makeTestRouter()
		useAuthStore.getState().setAuthToken("fake-token")
		vi.mocked(apiClient.get).mockImplementation((url: string) => {
			if (url === ApiPaths.WORKSPACE) {
				return Promise.resolve({ data: envoyeWorkspace })
			}
			if (url === ApiPaths.CURRENT_TEAMMATE) {
				return Promise.resolve({ data: teammateFactory.build() })
			}
			return Promise.reject(new Error(`Unexpected GET ${url}`))
		})
		await router.navigate({
			to: "/workspace",
			search: { code: "test-workspace-code" },
		})
		renderWithQueryClient(
			<LanguageProvider>
				<RouterProvider router={router} />
			</LanguageProvider>,
			{ queryClient },
		)
		const menuTrigger = screen.getByRole("button") // MoreVertical trigger
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
