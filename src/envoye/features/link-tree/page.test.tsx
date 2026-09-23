import { createAppRouter } from "@/app-router.tsx"
import LanguageProvider from "@common/i18n/LanguageProvider.tsx"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@common/renderWithQueryClient.tsx"
import { Pages } from "@common/utils/pages.ts"
import { RouterProvider } from "@tanstack/react-router"
import { screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

describe("LinkTree", () => {
	async function renderLinkTree() {
		const queryClient = createTestQueryClient()
		const router = createAppRouter(queryClient)
		await router.navigate({ to: Pages.LINK_TREE })

		renderWithQueryClient(
			<LanguageProvider>
				<RouterProvider router={router} context={{ queryClient }} />
			</LanguageProvider>,
			{ queryClient },
		)
	}

	it("links sign in to login and contact us to email", async () => {
		await renderLinkTree()

		await waitFor(() => {
			expect(
				screen.getByRole("link", { name: /Sign in to Envoye/ }),
			).toHaveAttribute("href", Pages.LOGIN)
		})
		expect(
			screen.getByRole("link", { name: /Sign in to Envoye/ }),
		).toHaveAttribute("target", "_blank")

		expect(
			screen.getByRole("button", { name: /Fahari Bookings/ }),
		).toBeDisabled()
		expect(screen.getByText("Book a ride from our fleets")).toBeInTheDocument()
		const contactUs = screen.getByRole("link", { name: /Contact Us/ })
		expect(contactUs).toHaveAttribute("href", "mailto:hellofahari@gmail.com")
		expect(contactUs).toHaveAttribute("target", "_blank")
	})
})
