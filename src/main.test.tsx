import { describe, expect, it, vi } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import {
	RouterProvider,
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router"
import { RootRouteComponent } from "./main.tsx"

// Mock components that might cause issues in tests
vi.mock("@tanstack/react-router-devtools", () => ({
	TanStackRouterDevtools: () => null,
}))

function makeTestRoute() {
	const rootRoute = createRootRoute({
		component: RootRouteComponent,
	})

	const testRoute = createRoute({
		getParentRoute: () => rootRoute,
		path: "/",
		component: () => <div>Test</div>,
	})

	return createRouter({
		routeTree: rootRoute.addChildren([testRoute]),
		context: {},
	})
}

describe("App Structure", () => {
	it("should include Toaster component in RootRouteComponent", async () => {
		const router = makeTestRoute()
		render(<RouterProvider router={router} />)
		await waitFor(
			() => {
				expect(screen.getByTestId("toaster")).toBeInTheDocument()
			},
			{ timeout: 3000 },
		)
	})
})
