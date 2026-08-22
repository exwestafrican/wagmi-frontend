import { rootRoute } from "@envoye/routing/root.ts"
import NotFound from "@envoye/features/not-found.tsx"
import { z } from "zod"
import { AdminPages } from "@common/utils/pages.ts"
import { createRoute } from "@tanstack/react-router"
import { AdminPage } from "@envoye/features/admin/admin.page.tsx"
import { AdminLoginPage } from "@envoye/features/admin/login/page.tsx"
import AdminFeatureFlagPage from "@envoye/features/admin/feature-flags/page.tsx"
import AdminBackfillPage from "@envoye/features/admin/backfill/page.tsx"
import AdminDevicesPage from "@envoye/features/admin/devices/page.tsx"
import { RootRouteComponent } from "@envoye/routing/root-route-component.tsx"
import { handleAuthToken } from "@envoye/features/auth/hooks/handle-auth-token"
import { ENVOYE_WORKSPACE_CODE } from "@envoye/constants.ts"
import { permissionQueryOptions } from "@envoye/features/permission/api/permissions.ts"

export const adminLayoutRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "admin",
	notFoundComponent: NotFound,
	beforeLoad: async ({ location, context }) => {
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
