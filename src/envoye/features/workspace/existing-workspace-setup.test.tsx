import { describe, expect, test, beforeEach } from "vitest"
import { faker } from "@faker-js/faker"
import { waitFor } from "@testing-library/react"
import { Pages } from "@common/utils/pages.ts"
import { useAuthStore } from "@common/stores/auth.store.ts"
import { navigateToTestPage } from "@envoye/test/helpers/navigate"
import { mockGetUrls } from "@common/test/helpers/mocks.ts"
import { ApiPaths } from "@envoye/constants.ts"
import { WorkspaceStatus } from "@envoye/features/workspace/interface/workspace.interface.ts"
import { teammateFactory } from "@envoye/test/factory/teammate.ts"

describe("Existing workspace setup", () => {
	describe("Auto redirect works as expected", () => {
		beforeEach(() => {
			useAuthStore.getState().clearAuthToken()
		})

		test("it redirects valid url to dashboard", async () => {
			const fakeAccessToken = faker.string.alphanumeric(20)
			const teammate = teammateFactory.build()
			mockGetUrls()
				.url(ApiPaths.WORKSPACE)
				.respond({
					code: "e8r4z7",
					name: "Envoye",
					status: WorkspaceStatus.ACTIVE,
				})
				.url(ApiPaths.CURRENT_TEAMMATE)
				.respond(teammate)
				.url(ApiPaths.FEATURE_FLAGS_ENABLED)
				.respond([])
				.url(ApiPaths.CONVERSATIONS)
				.respond([])
				.url(ApiPaths.ACTIVE_TEAMMATES)
				.respond([teammate])
				.url(ApiPaths.CONVERSATION_CHAT_HISTORY)
				.respond([])
				.apply()

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
