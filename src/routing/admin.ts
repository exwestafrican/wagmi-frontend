import { rootRoute } from "@/routing/root.ts"
import NotFound from "@/features/not-found.tsx"
import { z } from "zod"
import { redirect } from "@tanstack/react-router"
import { AdminPages } from "@/utils/pages.ts"
import { createRoute } from "@tanstack/react-router"
import { AdminPage } from "@/features/admin/admin.page.tsx"
import { AdminLoginPage } from "@/features/admin/features/login/page.tsx"
import getAuthToken from "@/lib/get-auth-token.ts"
import AdminFeatureFlagPage from "@/features/admin/features/feature-flags/page.tsx"
import AdminBackfillPage from "@/features/admin/features/backfill/page.tsx"
import { RootRouteComponent } from "@/routing/root-route-component.tsx"

export const adminLayoutRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "admin",
	notFoundComponent: NotFound,
	beforeLoad: ({ location }) => {
		const token = getAuthToken()
		if (!token) {
			throw redirect({
				to: AdminPages.LOGIN,
				search: { redirect: location.href },
			})
		}
	},
	component: RootRouteComponent,
})

const adminIndexRoute = createRoute({
	getParentRoute: () => adminLayoutRoute,
	path: "/",
	component: AdminPage,
})

export const adminLogin = createRoute({
	getParentRoute: () => rootRoute,
	path: "admin/login",
	validateSearch: (search) =>
		z.object({ redirect: z.string().optional() }).parse(search),
	component: AdminLoginPage,
})

const adminFeatureFlagRoute = createRoute({
	getParentRoute: () => adminLayoutRoute,
	path: "feature-flag",
	component: AdminFeatureFlagPage,
})

const adminBackfillPage = createRoute({
	getParentRoute: () => adminLayoutRoute,
	path: "backfill",
	component: AdminBackfillPage,
})

export const adminRouteTree = adminLayoutRoute.addChildren({
	adminIndexRoute,
	adminLogin,
	adminFeatureFlagRoute,
	adminBackfillPage,
})
