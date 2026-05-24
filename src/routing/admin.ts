import { rootRoute } from "@/routing/root.ts"
import NotFound from "@/features/not-found.tsx"
import { z } from "zod"
import { redirect } from "@tanstack/react-router"
import { AdminPages } from "@/utils/pages.ts"
import { createRoute } from "@tanstack/react-router"
import { AdminPage } from "@/features/admin/admin.page.tsx"
import { AdminLoginPage } from "@/features/admin/features/login/page.tsx"
import getAuthToken from "@/lib/get-auth-token.ts"

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
	component: AdminPage,
})

const adminIndexRoute = createRoute({
	getParentRoute: () => adminLayoutRoute,
	path: "/",
})

export const adminLogin = createRoute({
	getParentRoute: () => rootRoute,
	path: "admin/login",
	validateSearch: (search) =>
		z.object({ redirect: z.string().optional() }).parse(search),
	component: AdminLoginPage,
})

export const adminRouteTree = adminLayoutRoute.addChildren({
	adminIndexRoute,
	adminLogin,
})
