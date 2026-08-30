import { createRootRouteWithContext, createRoute } from "@tanstack/react-router"
import type { QueryClient } from "@tanstack/react-query"
import WaitListPage from "@envoye/features/waitlist/waitlist-page.tsx"
import SignupPage from "@envoye/features/auth/signup-page.tsx"
import { z } from "zod"
import LoginPage from "@envoye/features/auth/login-page.tsx"
import SetupWorkspacePage from "@envoye/features/workspace/new-workspace-setup.tsx"
import { ExistingWorkspaceSetup } from "@envoye/features/workspace/existing-workspace-setup.tsx"
import { AcceptInvite } from "@envoye/features/workspace/accept-invite.tsx"
import { CheckEmail } from "@envoye/features/auth/check-email-page.tsx"
import NotFound from "@envoye/features/not-found.tsx"
import { RootRouteComponent } from "@envoye/routing/root-route-component.tsx"
import { handleAuthToken } from "@envoye/features/auth/hooks/handle-auth-token.ts"
import { Pages } from "@common/utils/pages"

export type RouterContext = {
	queryClient: QueryClient
}

export const rootRoute = createRootRouteWithContext<RouterContext>()({
	component: RootRouteComponent,
	notFoundComponent: NotFound,
})

export const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: WaitListPage,
})

export const signupRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "signup",
	component: SignupPage,
})

export const loginRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "login",
	validateSearch: (search) =>
		z.object({ redirect: z.string().optional() }).parse(search),
	component: LoginPage,
})

export const workspaceSetupRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "setup/$preVerificationId/workspace",
	component: SetupWorkspacePage,
})

export const existingWorkspaceSetupRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "setup/workspace",
	validateSearch: z.object({
		code: z.string(),
	}),
	beforeLoad: ({ location }) => {
		handleAuthToken(location, Pages.LOGIN)
	},
	component: ExistingWorkspaceSetup,
})

export const acceptInviteRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/workspace-invite",
	validateSearch: z.object({
		inviteCode: z.string(),
	}),
	component: AcceptInvite,
})

export const checkEmailRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/check-email",
	validateSearch: z.object({
		email: z.email(),
		type: z.string(),
		redirect: z.string().optional(),
	}),
	component: CheckEmail,
})
