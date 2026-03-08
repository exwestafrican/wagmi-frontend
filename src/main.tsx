import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import {
	Outlet,
	RouterProvider,
	createRootRoute,
	createRoute,
	createRouter,
	redirect,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import LanguageProvider from "./i18n/LanguageProvider.tsx"

import "./styles.css"
import reportWebVitals from "./reportWebVitals.ts"

import WaitListPage from "@/features/waitlist/waitlist-page"
import SignupPage from "@/features/auth/signup-page.tsx"
import { Toaster } from "sonner"
import SetupWorkspacePage from "@/features/workspace/new-workspace-setup.tsx"
import LoginPage from "@/features/auth/login-page.tsx"
import WorkspacePage from "@/features/workspace/workspace.page.tsx"
import { z } from "zod"
import { ExistingWorkspaceSetup } from "@/features/workspace/existing-workspace-setup.tsx"
import { useAuthStore } from "@/stores/auth.store.ts"

// Create a client
const queryClient = new QueryClient({})

export function RootRouteComponent() {
	return (
		<>
			<Outlet />
			<div data-testid="toaster">
				<Toaster richColors position="top-right" />
			</div>
			<TanStackRouterDevtools />
		</>
	)
}

const rootRoute = createRootRoute({
	component: RootRouteComponent,
})

const authRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "auth",
	component: () => <Outlet />,
})

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: WaitListPage,
})

// auth routes
const signupRoute = createRoute({
	getParentRoute: () => authRoute,
	path: "signup",
	component: SignupPage,
})

const loginRoute = createRoute({
	getParentRoute: () => authRoute,
	path: "login",
	component: LoginPage,
})

// setup routes
const workspaceSetupRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "setup/$preVerificationId/workspace",
	component: SetupWorkspacePage,
})

const existingWorkspaceSetupRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "setup/workspace",
	validateSearch: z.object({
		code: z.string(),
		access_token: z.string().optional(),
	}),
	component: ExistingWorkspaceSetup,
})

// workspace route
const workspaceRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "workspace",
	validateSearch: (search) =>
		z
			.object({
				code: z.string(),
			})
			.parse(search),
	beforeLoad: ({ location }) => {
		const token = useAuthStore.getState().token
		if (!token) {
			throw redirect({ to: "/auth/login", search: { redirect: location.href } })
		}
	},
	component: WorkspacePage,
})

const routeTree = rootRoute.addChildren([
	indexRoute,
	workspaceSetupRoute,
	existingWorkspaceSetupRoute,
	workspaceRoute,
	authRoute.addChildren([signupRoute, loginRoute]),
])

const router = createRouter({
	routeTree,
	context: {},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
})
console.log(router.routesByPath)
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router
	}
}

const rootElement = document.getElementById("app")
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<StrictMode>
			<LanguageProvider>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</LanguageProvider>
		</StrictMode>,
	)
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
