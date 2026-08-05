import { rootRoute } from "@/routing/root.ts"
import NotFound from "@/features/not-found.tsx"
import { z } from "zod"
import { AdminPages } from "@/utils/pages.ts"
import { createRoute } from "@tanstack/react-router"
import { AdminPage } from "@/features/admin/admin.page.tsx"
import { AdminLoginPage } from "@/features/admin/features/login/page.tsx"
import AdminFeatureFlagPage from "@/features/admin/features/feature-flags/page.tsx"
import AdminBackfillPage from "@/features/admin/features/backfill/page.tsx"
import AdminDevicesPage from "@/features/admin/features/devices/page.tsx"
import { RootRouteComponent } from "@/routing/root-route-component.tsx"
import { handleAuthToken } from "@/features/auth/hooks/handle-auth-token"
import { ENVOYE_WORKSPACE_CODE } from "@/constants.ts"
import { permissionQueryOptions } from "@/features/permission/api/permissions.ts"
export const adminLayoutRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "admin",
	notFoundComponent: NotFound,
	beforeLoad: ({ location }) => {
		handleAuthToken(location, AdminPages.LOGIN)
    try {
			await context.queryClient.ensureQueryData(
				permissionQueryOptions(ENVOYE_WORKSPACE_CODE),
			)
		} catch {
			// Prefetch failed; pages read error/empty from the query cache.
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

const adminDevicesRoute = createRoute({
	getParentRoute: () => adminLayoutRoute,
	path: "devices",
	component: AdminDevicesPage,
})

export const adminRouteTree = adminLayoutRoute.addChildren({
	adminIndexRoute,
	adminLogin,
	adminFeatureFlagRoute,
	adminBackfillPage,
	adminDevicesRoute,
})
