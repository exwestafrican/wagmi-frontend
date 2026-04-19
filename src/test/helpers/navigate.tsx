import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient.tsx"
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
import { ExistingWorkspaceSetup } from "@/features/workspace/existing-workspace-setup.tsx"
import { AcceptInvite } from "@/features/workspace/accept-invite.tsx"
import WorkspacePage from "@/features/workspace/workspace.page.tsx"
import WorkspaceDirectoryPage from "@/features/directory/workspace-directory-page.tsx"
import LanguageProvider from "@/i18n/LanguageProvider.tsx"

function WaitlistPlaceholder() {
	return <div data-testid="waitlist-route">Waitlist</div>
}

export function makeAuthTestRouter() {
	const rootRoute = createRootRoute({
		component: () => <Outlet />,
	})

	const indexRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/",
		component: WaitlistPlaceholder,
	})

	const signupRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "signup",
		component: SignupPage,
	})

	const loginRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "login",
		component: LoginPage,
	})

	const checkEmailRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/check-email",
		validateSearch: z.object({
			email: z.email(),
			type: z.string(),
		}),
		component: CheckEmail,
	})

	return createRouter({
		routeTree: rootRoute.addChildren([
			indexRoute,
			signupRoute,
			loginRoute,
			checkEmailRoute,
		]),
		context: {},
	})
}

export function makeTestRouter() {
	const rootRoute = createRootRoute({
		component: () => <Outlet />,
	})
	const setupRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/setup/workspace",
		validateSearch: z.object({ code: z.string() }),
		component: ExistingWorkspaceSetup,
	})

	const workspaceRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/workspace",
		validateSearch: z.object({ code: z.string() }),
		component: WorkspacePage,
	})

	const workspaceDirectoryRoute = createRoute({
		getParentRoute: () => workspaceRoute,
		path: "directory",
		validateSearch: z.object({ code: z.string() }),
		component: WorkspaceDirectoryPage,
	})

	const acceptInviteRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/workspace-invite",
		validateSearch: z.object({ inviteCode: z.string() }),
		component: AcceptInvite,
	})

	const checkEmailRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/check-email",
		validateSearch: z.object({
			email: z.email(),
			type: z.string(),
		}),
		component: CheckEmail,
	})

	return createRouter({
		routeTree: rootRoute.addChildren([
			setupRoute,
			workspaceRoute.addChildren([workspaceDirectoryRoute]),
			acceptInviteRoute,
			checkEmailRoute,
		]),
		context: {},
	})
}

export async function navigateToTestPage({
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
	renderWithQueryClient(
		<LanguageProvider>
			<RouterProvider router={router} />
		</LanguageProvider>,
		{ queryClient },
	)
	return { router, navigateSpy }
}
