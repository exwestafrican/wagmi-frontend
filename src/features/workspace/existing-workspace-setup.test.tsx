import { describe, expect, vi, test, beforeEach } from "vitest"
import { faker } from "@faker-js/faker"
import { waitFor } from "@testing-library/react"
import { Pages } from "@/utils/pages.ts"
import { useAuthStore } from "@/stores/auth.store.ts"
import { navigateToTestPage } from "@/test/helpers/navigate"

vi.mock("@/hooks/user-countdown.ts", async () => {
	return {
		useCountDown: vi.fn(),
	}
})

import { useCountDown } from "@/hooks/user-countdown.ts"

describe("Existing workspace setup", () => {
	describe("Auto redirect works as expected", () => {
		beforeEach(() => {
			useAuthStore.getState().clearAuthToken()
			vi.mocked(useCountDown).mockReturnValue({ count: 0, isFinished: true })
		})

		test("it redirects valid url to dashboard", async () => {
			const fakeAccessToken = faker.string.alphanumeric(20)
			const { navigateSpy } = await navigateToTestPage({
				to: "/setup/workspace",
				search: { code: "e8r4z7" },
				hash: `access_token=${fakeAccessToken}`,
			})

			await waitFor(
				() => {
					expect(navigateSpy).toHaveBeenCalledWith({
						to: Pages.WORKSPACE,
						search: { code: "e8r4z7" },
					})
				},
				{ timeout: 2000 },
			)
		})

		test("Invalid link redirects user to login page", async () => {
			const { navigateSpy } = await navigateToTestPage({
				to: "/setup/workspace",
				search: { code: "e8r4z7" },
			})

			await waitFor(() => {
				expect(navigateSpy).toHaveBeenCalledWith(
					expect.objectContaining({ to: Pages.LOGIN }),
				)
			})
		})
	})
})
