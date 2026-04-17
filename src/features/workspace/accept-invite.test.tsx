import { beforeEach, describe, expect, it, vi } from "vitest"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { act, screen, waitFor } from "@testing-library/react"
import { AxiosError } from "axios"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths, CHECK_MAIL_REASON } from "@/constants.ts"
import { Pages } from "@/utils/pages.ts"
import { navigateToTestPage } from "@/test/helpers/navigate.tsx"

vi.mock("@/hooks/use-debounce", () => ({
	useDebounce: (value: unknown) => value,
}))

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

	describe("username availability check", () => {
		const FAKE_WORKSPACE_CODE = "9Jk076"
		const FAKE_RECIPIENT_EMAIL = "laura@useenvoye.co"
		const FAKE_INVITE_CODE = "fake-invite-code"

		function mockVerifyInvite() {
			return Promise.resolve({
				data: {
					recipientEmail: FAKE_RECIPIENT_EMAIL,
					workspaceCode: FAKE_WORKSPACE_CODE,
					inviteCode: FAKE_INVITE_CODE,
				},
			})
		}

		async function renderAndWaitForForm() {
			await navigateToTestPage({
				to: "/workspace-invite",
				search: { inviteCode: FAKE_INVITE_CODE },
			})

			await act(async () => {
				await new Promise((r) => setTimeout(r, 2600))
			})

			await waitFor(() => {
				expect(screen.getByTestId("teammate-username")).toBeInTheDocument()
			})
		}

		it(
			"shows 'Username is available' when the username is free (200)",
			{ timeout: 15000 },
			async () => {
				vi.mocked(apiClient.get).mockImplementation((url) => {
					if (url === ApiPaths.VERIFY_INVITE) return mockVerifyInvite()
					if (url === ApiPaths.CHECK_USERNAME) return Promise.resolve({})
					return Promise.reject(new Error(`unexpected: ${url}`))
				})

				await renderAndWaitForForm()
				await user.type(screen.getByTestId("teammate-username"), "jo")

				await waitFor(() => {
					expect(screen.getByText("Username is available")).toBeInTheDocument()
				})
			},
		)

		it(
			"shows 'Username is taken' error and disables submit when username is taken (409)",
			{ timeout: 15000 },
			async () => {
				const conflictError = new AxiosError("Conflict", "ERR_BAD_REQUEST")
				conflictError.response = {
					status: 409,
					data: null,
					headers: {},
					config: {} as never,
					statusText: "Conflict",
				}

				vi.mocked(apiClient.get).mockImplementation((url) => {
					if (url === ApiPaths.VERIFY_INVITE) return mockVerifyInvite()
					if (url === ApiPaths.CHECK_USERNAME)
						return Promise.reject(conflictError)
					return Promise.reject(new Error(`unexpected: ${url}`))
				})

				await renderAndWaitForForm()
				await user.type(screen.getByTestId("teammate-first-name"), "John")
				await user.type(screen.getByTestId("teammate-last-name"), "Doe")
				await user.type(screen.getByTestId("teammate-username"), "john.doe")

				await waitFor(() => {
					expect(
						screen.getByTestId("teammate-username-form-message"),
					).toHaveTextContent("Username is taken")
				})
				expect(screen.getByTestId("submit-button")).toBeDisabled()
			},
		)

		it(
			"clears the 'Username is taken' error when the user changes the username",
			{ timeout: 15000 },
			async () => {
				const conflictError = new AxiosError("Conflict", "ERR_BAD_REQUEST")
				conflictError.response = {
					status: 409,
					data: null,
					headers: {},
					config: {} as never,
					statusText: "Conflict",
				}

				vi.mocked(apiClient.get).mockImplementation((url) => {
					if (url === ApiPaths.VERIFY_INVITE) return mockVerifyInvite()
					if (url === ApiPaths.CHECK_USERNAME)
						return Promise.reject(conflictError)
					return Promise.reject(new Error(`unexpected: ${url}`))
				})

				await renderAndWaitForForm()
				await user.type(screen.getByTestId("teammate-username"), "john.doe")

				await waitFor(() => {
					expect(
						screen.getByTestId("teammate-username-form-message"),
					).toHaveTextContent("Username is taken")
				})

				await user.clear(screen.getByTestId("teammate-username"))

				await waitFor(() => {
					expect(
						screen.queryByText("Username is taken"),
					).not.toBeInTheDocument()
				})
			},
		)
	})
})
