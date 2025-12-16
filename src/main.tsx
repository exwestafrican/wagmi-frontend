import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import {
	Outlet,
	RouterProvider,
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import "./styles.css"
import reportWebVitals from "./reportWebVitals.ts"

import UploadPage from "@/features/file-upload/upload-page"
import ChatPage from "@/features/chat/chat-page"

// Create a client
const queryClient = new QueryClient({})

const rootRoute = createRootRoute({
	component: () => (
		<>
			<Outlet />
			<TanStackRouterDevtools />
		</>
	),
})

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: UploadPage,
})

const chatRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/chat",
	component: ChatPage,
})

const routeTree = rootRoute.addChildren([indexRoute, chatRoute])

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
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</StrictMode>,
	)
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
