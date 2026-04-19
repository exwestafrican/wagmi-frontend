import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { Outlet, RouterProvider, createRouter } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import LanguageProvider from "./i18n/LanguageProvider.tsx"

import "./styles.css"
import reportWebVitals from "./reportWebVitals.ts"

import { Toaster } from "sonner"
import {
	acceptInviteRoute,
	checkEmailRoute,
	existingWorkspaceSetupRoute,
	indexRoute,
	loginRoute,
	rootRoute,
	signupRoute,
	workspaceSetupRoute,
} from "@/routing/root.ts"
import { workspaceRouteTree } from "@/routing/workspace.ts"

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

const routeTree = rootRoute.addChildren([
	indexRoute,
	workspaceSetupRoute,
	existingWorkspaceSetupRoute,
	signupRoute,
	loginRoute,
	acceptInviteRoute,
	checkEmailRoute,
	workspaceRouteTree,
])

const router = createRouter({
	routeTree,
	context: {},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
})

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
