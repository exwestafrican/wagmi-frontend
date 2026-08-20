import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient.tsx"
import type { QueryClient } from "@tanstack/react-query"
import { vi } from "vitest"
import {
	createRootRoute,
	createRoute,
	createRouter,
	Outlet,
	RouterProvider,
} from "@tanstack/react-router"
import { z } from "zod"
import LoginPage from "@/features/auth/login-page.tsx"
import SignupPage from "@/features/auth/signup-page.tsx"
import { CheckEmail } from "@/features/auth/check-email-page.tsx"
import LanguageProvider from "@/i18n/LanguageProvider.tsx"
import { Pages } from "@/utils/pages.ts"
import { AdminLoginPage } from "@/features/admin/features/login/page.tsx"
import { handleAuthToken } from "@/features/auth/hooks/handle-auth-token.ts"
import {
	acceptInviteRoute,
	checkEmailRoute,
	existingWorkspaceSetupRoute,
	loginRoute,
	rootRoute,
} from "@/routing/root.ts"
import { workspaceRouteTree } from "@/routing/workspace.ts"

function WaitlistPlaceholder() {
	return <div data-testid="waitlist-route">Waitlist</div>
}

export function makeAuthTestRouter() {
	const authRootRoute = createRootRoute({
		component: () => <Outlet />,
	})

	const indexRoute = createRoute({
		getParentRoute: () => authRootRoute,
		path: "/",
		component: WaitlistPlaceholder,
	})

	const signupRoute = createRoute({
		getParentRoute: () => authRootRoute,
		path: "signup",
		component: SignupPage,
	})

	const authLoginRoute = createRoute({
		getParentRoute: () => authRootRoute,
		path: "login",
		validateSearch: (search) =>
			z.object({ redirect: z.string().optional() }).parse(search),
		component: LoginPage,
	})

	const authCheckEmailRoute = createRoute({
		getParentRoute: () => authRootRoute,
		path: "/check-email",
		validateSearch: z.object({
			email: z.email(),
			type: z.string(),
			redirect: z.string().optional(),
		}),
		component: CheckEmail,
	})

	const setupWorkspaceRoute = createRoute({
		getParentRoute: () => authRootRoute,
		path: "/setup/workspace",
		validateSearch: z.object({ code: z.string() }),
		component: () => <div data-testid="setup-workspace-route">Setup</div>,
	})

	const workspaceLayoutRoute = createRoute({
		getParentRoute: () => authRootRoute,
		path: "workspace",
		validateSearch: (search) => z.object({ code: z.string() }).parse(search),
		beforeLoad: ({ location }) => {
			handleAuthToken(location, Pages.LOGIN)
		},
		component: () => <Outlet />,
	})

	const workspaceDirectoryRoute = createRoute({
		getParentRoute: () => workspaceLayoutRoute,
		path: "directory",
		component: () => (
			<div data-testid="workspace-directory-route">Directory</div>
		),
	})

	const conversationRoute = createRoute({
		getParentRoute: () => workspaceLayoutRoute,
		path: "conversation",
		validateSearch: z.object({
			code: z.string(),
			conversationId: z.number(),
		}),
		component: () => <div data-testid="conversation-route">Conversation</div>,
	})

	const stubWorkspaceRouteTree = workspaceLayoutRoute.addChildren([
		workspaceDirectoryRoute,
		conversationRoute,
	])

	const adminLoginRoute = createRoute({
		getParentRoute: () => authRootRoute,
		path: "/admin/login",
		component: AdminLoginPage,
	})

	const adminHomeRoute = createRoute({
		getParentRoute: () => authRootRoute,
		path: "/admin",
		component: () => <div data-testid="admin-home-route">Admin</div>,
	})

	return createRouter({
		routeTree: authRootRoute.addChildren([
			indexRoute,
			signupRoute,
			authLoginRoute,
			authCheckEmailRoute,
			setupWorkspaceRoute,
			stubWorkspaceRouteTree,
			adminLoginRoute,
			adminHomeRoute,
		]),
		context: {},
	})
}

export function makeTestRouter(queryClient: QueryClient) {
	return createRouter({
		routeTree: rootRoute.addChildren([
			existingWorkspaceSetupRoute,
			loginRoute,
			workspaceRouteTree,
			acceptInviteRoute,
			checkEmailRoute,
		]),
		context: { queryClient },
	})
}

export async function navigateToTestPage({
	to,
	search,
	hash,
	seedQueryCache,
}: {
	to: string
	search: Record<string, string | number>
	hash?: string
	seedQueryCache?: (queryClient: QueryClient) => void
}) {
	const queryClient = createTestQueryClient()
	seedQueryCache?.(queryClient)
	const router = makeTestRouter(queryClient)
	const navigateSpy = vi.spyOn(router, "navigate") // spy BEFORE render

	if (Object.values(search).length > 0) {
		await router.navigate({ to, search, hash })
	} else {
		await router.navigate({ to, hash })
	}
	renderWithQueryClient(
		<LanguageProvider>
			<RouterProvider router={router} context={{ queryClient }} />
		</LanguageProvider>,
		{ queryClient },
	)
	return { router, navigateSpy, queryClient }
}
