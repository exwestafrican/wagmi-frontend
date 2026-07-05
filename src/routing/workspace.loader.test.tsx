import { describe, expect, test, vi, beforeEach } from "vitest"
import { createRouter, RouterProvider } from "@tanstack/react-router"
import { screen } from "@testing-library/react"
import type { QueryClient } from "@tanstack/react-query"
import { rootRoute } from "@/routing/root.ts"
import { workspaceRouteTree } from "@/routing/workspace.ts"
import { loginRoute } from "@/routing/root.ts"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient.tsx"
import { useAuthStore } from "@/stores/auth.store.ts"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"
import { WorkspaceCode } from "@/test/constants.ts"
import { teammateFactory } from "@/test/factory/teammate.ts"
import { WorkspaceStatus } from "@/features/workspace/interface/workspace.interface.ts"
import { ENABLED_FEATURES } from "@/features/feature-flag/api/feature-flags.ts"
import { CURRENT_TEAMMATE_QUERY_KEY } from "@/features/workspace/api/current-teammate.ts"
import { WORKSPACE } from "@/features/workspace/api/workspace.ts"
import LanguageProvider from "@/i18n/LanguageProvider.tsx"

vi.mock("@tanstack/react-router-devtools", () => ({
	TanStackRouterDevtools: () => null,
}))

function makeWorkspaceLoaderRouter(queryClient: QueryClient) {
	return createRouter({
		routeTree: rootRoute.addChildren([loginRoute, workspaceRouteTree]),
		context: { queryClient },
	})
}

describe("workspaceLayoutRoute loader", () => {
	const envoyeWorkspace = {
		code: WorkspaceCode.ENVOYE,
		name: "Envoye",
		status: WorkspaceStatus.ACTIVE,
	}
	const sidebarTeammate = teammateFactory.build({ username: "loader.test.user" })
	const enabledFeatures = ["can_integrate_whatsapp"]

	beforeEach(() => {
		useAuthStore.getState().clearAuthToken()
		vi.mocked(apiClient.get).mockImplementation((url: string) => {
			if (url === ApiPaths.WORKSPACE) {
				return Promise.resolve({ data: envoyeWorkspace })
			}
			if (url === ApiPaths.CURRENT_TEAMMATE) {
				return Promise.resolve({ data: sidebarTeammate })
			}
			if (url === ApiPaths.FEATURE_FLAGS_ENABLED) {
				return Promise.resolve({ data: enabledFeatures })
			}
			if (url === ApiPaths.CONVERSATIONS) {
				return Promise.resolve({ data: [] })
			}
			return Promise.reject(new Error(`Unexpected GET ${url}`))
		})
	})

	test("prefetches workspace session data before rendering workspace UI", async () => {
		useAuthStore.getState().setAuthToken("fake-token")
		const queryClient = createTestQueryClient()
		const router = makeWorkspaceLoaderRouter(queryClient)

		await router.navigate({
			to: "/workspace/directory",
			search: { code: envoyeWorkspace.code },
		})

		expect(apiClient.get).toHaveBeenCalledWith(
			ApiPaths.WORKSPACE,
			expect.objectContaining({ params: { code: envoyeWorkspace.code } }),
		)
		expect(apiClient.get).toHaveBeenCalledWith(
			ApiPaths.CURRENT_TEAMMATE,
			expect.objectContaining({
				params: { workspaceCode: envoyeWorkspace.code },
			}),
		)
		expect(apiClient.get).toHaveBeenCalledWith(
			ApiPaths.FEATURE_FLAGS_ENABLED,
			expect.objectContaining({
				params: { workspaceCode: envoyeWorkspace.code },
			}),
		)

		expect(queryClient.getQueryData([WORKSPACE, envoyeWorkspace.code])).toBeDefined()
		expect(
			queryClient.getQueryData([CURRENT_TEAMMATE_QUERY_KEY, envoyeWorkspace.code]),
		).toEqual(sidebarTeammate)
		expect(
			queryClient.getQueryData([ENABLED_FEATURES, envoyeWorkspace.code]),
		).toEqual(enabledFeatures)

		renderWithQueryClient(
			<LanguageProvider>
				<RouterProvider router={router} context={{ queryClient }} />
			</LanguageProvider>,
			{ queryClient },
		)

		expect(await screen.findByText(sidebarTeammate.username)).toBeInTheDocument()

		const workspaceCalls = vi
			.mocked(apiClient.get)
			.mock.calls.filter(([url]) => url === ApiPaths.WORKSPACE)
		const teammateCalls = vi
			.mocked(apiClient.get)
			.mock.calls.filter(([url]) => url === ApiPaths.CURRENT_TEAMMATE)
		const featureFlagCalls = vi
			.mocked(apiClient.get)
			.mock.calls.filter(([url]) => url === ApiPaths.FEATURE_FLAGS_ENABLED)

		expect(workspaceCalls).toHaveLength(1)
		expect(teammateCalls).toHaveLength(1)
		expect(featureFlagCalls).toHaveLength(1)
	})

	test("redirects to login when no auth token is present", async () => {
		const queryClient = createTestQueryClient()
		const router = makeWorkspaceLoaderRouter(queryClient)

		await router.navigate({
			to: "/workspace/directory",
			search: { code: envoyeWorkspace.code },
		})

		expect(router.state.location.pathname).toBe("/login")
		expect(apiClient.get).not.toHaveBeenCalled()
	})
})
