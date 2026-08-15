import { describe, expect, it } from "vitest"
import { render, screen, waitFor } from "@testing-library/react"
import {
	RouterProvider,
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router"
import { RootRouteComponent } from "@/routing/root-route-component.tsx"

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
