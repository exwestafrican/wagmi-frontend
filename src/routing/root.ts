import { createRootRoute, createRoute } from "@tanstack/react-router"
import WaitListPage from "@/features/waitlist/waitlist-page.tsx"
import SignupPage from "@/features/auth/signup-page.tsx"
import { z } from "zod"
import LoginPage from "@/features/auth/login-page.tsx"
import SetupWorkspacePage from "@/features/workspace/new-workspace-setup.tsx"
import { ExistingWorkspaceSetup } from "@/features/workspace/existing-workspace-setup.tsx"
import { AcceptInvite } from "@/features/workspace/accept-invite.tsx"
import { CheckEmail } from "@/features/auth/check-email-page.tsx"
import NotFound from "@/features/not-found.tsx"
import { RootRouteComponent } from "@/routing/root-route-component.tsx"

export const rootRoute = createRootRoute({
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
		access_token: z.string().optional(),
	}),
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
	}),
	component: CheckEmail,
})
