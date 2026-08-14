import { describe, expect, test, beforeEach } from "vitest"
import { faker } from "@faker-js/faker"
import { waitFor } from "@testing-library/react"
import { Pages } from "@/utils/pages.ts"
import { useAuthStore } from "@/stores/auth.store.ts"
import { navigateToTestPage } from "@/test/helpers/navigate"

describe("Existing workspace setup", () => {
	describe("Auto redirect works as expected", () => {
		beforeEach(() => {
			useAuthStore.getState().clearAuthToken()
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
			const { router } = await navigateToTestPage({
				to: "/setup/workspace",
				search: { code: "e8r4z7" },
			})

			await waitFor(() => {
				expect(router.state.location.pathname).toBe(Pages.LOGIN)
			})
		})
	})
})
