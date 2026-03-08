import { describe, expect, vi, test, beforeEach } from "vitest"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient.tsx"
import { faker } from "@faker-js/faker"
import { waitFor, screen } from "@testing-library/react"
import { Pages } from "@/utils/pages.ts"
import { ExistingWorkspaceSetup } from "@/features/workspace/existing-workspace-setup.tsx"
import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
} from "@tanstack/react-router"
import { z } from "zod"

vi.mock("@/hooks/user-countdown.ts", async () => {
	return {
		useCountDown: vi.fn(),
	}
})

import { useCountDown } from "@/hooks/user-countdown.ts"
import userEvent, { type UserEvent } from "@testing-library/user-event"

describe("Existing workspace setup", () => {
	function makeTestRouter() {
		const rootRoute = createRootRoute({
			component: () => <Outlet />,
		})
		const setupRoute = createRoute({
			getParentRoute: () => rootRoute,
			path: "/setup/workspace",
			validateSearch: z.object({ code: z.string() }),
			component: ExistingWorkspaceSetup,
		})
		return createRouter({
			routeTree: rootRoute.addChildren([setupRoute]),
			context: {},
		})
	}

	async function navigateToTestPage({
		to,
		search,
		hash,
	}: { to: string; search: Record<string, string>; hash?: string }) {
		const queryClient = createTestQueryClient()
		const router = makeTestRouter()
		const navigateSpy = vi.spyOn(router, "navigate") // spy BEFORE render

		if (Object.values(search).length > 0) {
			await router.navigate({ to, search })
		} else {
			await router.navigate({ to })
		}
		if (hash) {
			window.location.hash = hash
		}
		renderWithQueryClient(<RouterProvider router={router} />, { queryClient })
		return { router, navigateSpy }
	}

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
