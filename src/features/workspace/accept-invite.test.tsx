import { beforeEach, describe, expect, it, vi } from "vitest"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { act, screen, waitFor } from "@testing-library/react"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths, CHECK_MAIL_REASON } from "@/constants.ts"
import { Pages } from "@/utils/pages.ts"
import { navigateToTestPage } from "@/test/helpers/navigate.tsx"

describe("AcceptInvite", () => {
	let user: UserEvent

	beforeEach(() => {
		user = userEvent.setup()
	})

	it(
		"navigates to check email after user enters details",
		async () => {
			vi.mocked(apiClient.get).mockResolvedValueOnce({
				data: { recipientEmail: "invitee@useenvoye.co", workspace: "Envoye" },
			})

			const { navigateSpy } = await navigateToTestPage({
				to: "/workspace-invite",
				search: { inviteCode: "fake-invite-code" },
			})

			await waitFor(() => {
				expect(apiClient.get).toHaveBeenCalledWith(ApiPaths.VERIFY_INVITE, {
					params: { inviteCode: "fake-invite-code" },
				})
			})

			// AcceptInvite reveals the form after LAG_MS=2500.
			await act(async () => {
				await new Promise((r) => setTimeout(r, 2600))
			})

			const emailInput = screen.getByTestId("email")
			await waitFor(() => {
				expect(emailInput).toHaveValue("invitee@useenvoye.co")
			})

			await user.type(screen.getByTestId("teammate-first-name"), "john")
			await user.tab()
			await user.type(screen.getByTestId("teammate-last-name"), "doe")
			await user.tab()
			await user.type(screen.getByTestId("teammate-username"), "john.doe")
			await user.tab()

			const submitButton = screen.getByTestId("submit-button")
			await waitFor(() => expect(submitButton).toBeEnabled())
			await user.click(submitButton)

			await waitFor(() => {
				expect(navigateSpy).toHaveBeenCalledWith(
					expect.objectContaining({
						to: Pages.CHECK_EMAIL,
						search: {
							email: "invitee@useenvoye.co",
							type: CHECK_MAIL_REASON.INVITE_ACCEPTED_SUCCESS,
						},
					}),
				)
			})
		},
		{ timeout: 15000 },
	)

	it(
		"shows invalid invitation screen when verify invite fails",
		async () => {
			vi.mocked(apiClient.get).mockRejectedValueOnce(
				new Error("invalid invite"),
			)

			await navigateToTestPage({
				to: "/workspace-invite",
				search: { inviteCode: "bad-code" },
			})

			await waitFor(() => {
				expect(apiClient.get).toHaveBeenCalledWith(ApiPaths.VERIFY_INVITE, {
					params: { inviteCode: "bad-code" },
				})
			})

			await act(async () => {
				await new Promise((r) => setTimeout(r, 2600))
			})

			expect(
				screen.getByRole("heading", { name: /Ooops/i }),
			).toBeInTheDocument()
			expect(screen.getByTestId("invalid-invite-continue")).toBeInTheDocument()
		},
		{ timeout: 15000 },
	)
})
