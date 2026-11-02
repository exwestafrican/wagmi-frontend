import { createAppRouter } from "@/app-router.tsx"
import LanguageProvider from "@common/i18n/LanguageProvider.tsx"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@common/renderWithQueryClient.tsx"
import { RouterProvider } from "@tanstack/react-router"
import { screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

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

	it("brands the tab as Envoye outside Fahari routes", async () => {
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
			expect(document.title).toBe("Envoye")
		})
		expect(
			document
				.querySelector<HTMLLinkElement>('link[rel="icon"]')
				?.getAttribute("href"),
		).toBe("/favicon.ico")
	})

	it("brands the tab as Fahari on Fahari routes", async () => {
		const queryClient = createTestQueryClient()
		const router = createAppRouter(queryClient)
		await router.navigate({ to: "/admin" })

		renderWithQueryClient(
			<LanguageProvider>
				<RouterProvider router={router} context={{ queryClient }} />
			</LanguageProvider>,
			{ queryClient },
		)

		await waitFor(() => {
			expect(document.title).toBe("Fahari")
		})
		expect(
			document
				.querySelector<HTMLLinkElement>('link[rel="icon"]')
				?.getAttribute("href"),
		).toBe("/fahari-favicon.svg")
	})
})
