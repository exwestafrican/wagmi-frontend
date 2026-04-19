import { beforeEach, describe, expect, it, vi } from "vitest"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { act, screen, waitFor } from "@testing-library/react"
import { HttpStatusCode } from "axios"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths, CHECK_MAIL_REASON } from "@/constants.ts"
import { Pages } from "@/utils/pages.ts"
import { navigateToTestPage } from "@/test/helpers/navigate.tsx"
import { decodedInviteFactory } from "@/test/factory/invite.ts"
import { mockError } from "@/test/helpers/mocks.ts"

vi.mock("@/hooks/use-debounce", () => ({
	useDebounce: (value: unknown) => value,
}))

describe("AcceptInvite", () => {
	let user: UserEvent

	beforeEach(() => {
		user = userEvent.setup()
	})

	async function navigateToAcceptInvite(config: {
		to: string
		search: { inviteCode: string }
	}) {
		vi.useFakeTimers()
		const { navigateSpy } = await navigateToTestPage(config)

		await act(async () => {
			await vi.advanceTimersByTimeAsync(2600)
		})

		vi.useRealTimers()
		return { navigateSpy }
	}

	it(
		"navigates to check email after user enters details",
		{ timeout: 15000 },
		async () => {
			const decodedInvite = decodedInviteFactory.build({
				recipientEmail: "dan@useenvoye.co",
			})
			vi.mocked(apiClient.get).mockResolvedValueOnce({
				data: decodedInvite,
			})

			const { navigateSpy } = await navigateToAcceptInvite({
				to: "/workspace-invite",
				search: { inviteCode: "fake-invite-code" },
			})

			expect(screen.getByTestId("email")).toHaveValue(
				decodedInvite.recipientEmail,
			)

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
							email: decodedInvite.recipientEmail,
							type: CHECK_MAIL_REASON.INVITE_ACCEPTED_SUCCESS,
						},
					}),
				)
			})
		},
	)

	it(
		"shows invalid invitation screen when verify invite fails",
		{ timeout: 15000 },
		async () => {
			vi.mocked(apiClient.get).mockRejectedValueOnce(
				new Error("invalid invite"),
			)

			await navigateToAcceptInvite({
				to: "/workspace-invite",
				search: { inviteCode: "bad-code" },
			})

			expect(apiClient.get).toHaveBeenCalledWith(ApiPaths.VERIFY_INVITE, {
				params: { inviteCode: "bad-code" },
			})

			expect(
				screen.getByRole("heading", { name: /Ooops/i }),
			).toBeInTheDocument()
			expect(screen.getByTestId("invalid-invite-continue")).toBeInTheDocument()
		},
	)

	describe("username availability check", () => {
		const fakeInvite = decodedInviteFactory.build()

		function mockVerifyInvite() {
			return Promise.resolve({
				data: fakeInvite,
			})
		}

		async function renderAndWaitForForm() {
			await navigateToTestPage({
				to: "/workspace-invite",
				search: { inviteCode: fakeInvite.inviteCode },
			})

			await act(async () => {
				await new Promise((r) => setTimeout(r, 2600))
			})

			await waitFor(() => {
				expect(screen.getByTestId("teammate-username")).toBeInTheDocument()
			})
		}

		it(
			"shows username available icon when the username is free (200)",
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
					expect(screen.getByTestId("username-available")).toBeInTheDocument()
				})
			},
		)

		it(
			"shows username taken icon and disables submit when username is taken (409)",
			{ timeout: 15000 },
			async () => {
				vi.mocked(apiClient.get).mockImplementation((url) => {
					if (url === ApiPaths.VERIFY_INVITE) return mockVerifyInvite()
					if (url === ApiPaths.CHECK_USERNAME)
						return Promise.reject(mockError(HttpStatusCode.Conflict))
					return Promise.reject(new Error(`unexpected: ${url}`))
				})

				await renderAndWaitForForm()
				await user.type(screen.getByTestId("teammate-first-name"), "John")
				await user.type(screen.getByTestId("teammate-last-name"), "Doe")
				await user.type(screen.getByTestId("teammate-username"), "john.doe")

				await waitFor(() => {
					expect(screen.getByTestId("username-taken")).toBeInTheDocument()
				})
				expect(screen.getByTestId("submit-button")).toBeDisabled()
			},
		)

		it(
			"clears the username taken icon when the user changes the username",
			{ timeout: 15000 },
			async () => {
				vi.mocked(apiClient.get).mockImplementation((url) => {
					if (url === ApiPaths.VERIFY_INVITE) return mockVerifyInvite()
					if (url === ApiPaths.CHECK_USERNAME)
						return Promise.reject(mockError(HttpStatusCode.Conflict))
					return Promise.reject(new Error(`unexpected: ${url}`))
				})

				await renderAndWaitForForm()
				await user.type(screen.getByTestId("teammate-username"), "john.doe")

				await waitFor(() => {
					expect(screen.getByTestId("username-taken")).toBeInTheDocument()
				})

				await user.clear(screen.getByTestId("teammate-username"))

				await waitFor(() => {
					expect(screen.queryByTestId("username-taken")).not.toBeInTheDocument()
				})
			},
		)
	})
})
