import { describe, expect, it } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import { RouterProvider } from "@tanstack/react-router"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@common/renderWithQueryClient.tsx"
import LanguageProvider from "@common/i18n/LanguageProvider.tsx"
import { createAppRouter } from "@/app-router.tsx"

describe("createAppRouter", () => {
	it("renders the Envoye link tree at /", async () => {
		const queryClient = createTestQueryClient()
		const router = createAppRouter(queryClient)
		await router.navigate({ to: "/" })

		renderWithQueryClient(
			<LanguageProvider>
				<RouterProvider router={router} context={{ queryClient }} />
			</LanguageProvider>,
			{ queryClient },
		)

		await waitFor(() => {
			expect(
				screen.getByRole("heading", { name: "Envoye" }),
			).toBeInTheDocument()
		})
		expect(
			screen.getByRole("link", { name: /Sign in to Envoye/ }),
		).toBeInTheDocument()
	})

	it("renders the Envoye login page at /login", async () => {
		const queryClient = createTestQueryClient()
		const router = createAppRouter(queryClient)
		await router.navigate({ to: "/login" })

		renderWithQueryClient(
			<LanguageProvider>
				<RouterProvider router={router} context={{ queryClient }} />
			</LanguageProvider>,
			{ queryClient },
		)

		await waitFor(() => {
			expect(
				screen.getByRole("heading", { name: "Welcome back" }),
			).toBeInTheDocument()
		})
		expect(router.state.location.pathname).toBe("/login")
	})
})
