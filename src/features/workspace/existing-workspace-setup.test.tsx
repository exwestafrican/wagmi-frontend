import { describe, expect, vi, test, beforeEach } from "vitest"
import { faker } from "@faker-js/faker"
import { waitFor, screen } from "@testing-library/react"
import { Pages } from "@/utils/pages.ts"

vi.mock("@/hooks/user-countdown.ts", async () => {
	return {
		useCountDown: vi.fn(),
	}
})

import { useCountDown } from "@/hooks/user-countdown.ts"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { navigateToTestPage } from "@/test/helpers/navaigate.tsx"

describe("Existing workspace setup", () => {
	describe("Auto redirect works as expected", () => {
		beforeEach(() => {
			vi.mocked(useCountDown).mockReturnValue({ count: 0, isFinished: true })
		})

		test("it redirects valid url to dashboard", async () => {
			const fakeAccessToken = faker.string.alphanumeric(20)
			const { navigateSpy } = await navigateToTestPage({
				to: "/setup/workspace",
				search: { code: "e8r4z7" },
				hash: `access_token=${fakeAccessToken}`,
			})

			await waitFor(() => {
				expect(navigateSpy).toHaveBeenCalledWith({
					to: Pages.WORKSPACE,
					search: { code: "e8r4z7" },
				})
			})
		})

		test("Invalid link redirects user to login page", async () => {
			const { navigateSpy } = await navigateToTestPage({
				to: "/setup/workspace",
				search: { code: "e8r4z7" },
			})

			await waitFor(() => {
				expect(navigateSpy).toHaveBeenCalledWith({ to: Pages.LOGIN })
			})
		})
	})

	describe("when auto redirect fails", () => {
		let user: UserEvent

		beforeEach(() => {
			user = userEvent.setup()
			vi.mocked(useCountDown).mockReturnValue({ count: 0, isFinished: false })
		})

		test("clicking button navigates to login", async () => {
			const { navigateSpy } = await navigateToTestPage({
				to: "/setup/workspace",
				search: { code: "e8r4z7" },
			})

			const redirectButton = await screen.findByRole("button")

			await user.click(redirectButton)

			expect(navigateSpy).toHaveBeenCalledWith({ to: Pages.LOGIN })
		})
	})
})
