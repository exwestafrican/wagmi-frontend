import { createAppRouter } from "@/app-router.tsx"
import LanguageProvider from "@common/i18n/LanguageProvider.tsx"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@common/renderWithQueryClient.tsx"
import { RouterProvider } from "@tanstack/react-router"
import { screen, waitFor } from "@testing-library/react"
import { describe, expect, it } from "vitest"

describe("Fahari home", () => {
	it("shows the link tree without sign in to Envoye", async () => {
		const queryClient = createTestQueryClient()
		const router = createAppRouter(queryClient, "fahari")
		await router.navigate({ to: "/" })

		renderWithQueryClient(
			<LanguageProvider>
				<RouterProvider router={router} context={{ queryClient }} />
			</LanguageProvider>,
			{ queryClient },
		)

		await waitFor(() => {
			expect(
				screen.getByRole("heading", { name: "Fahari" }),
			).toBeInTheDocument()
		})
		expect(screen.getByText("F")).toBeInTheDocument()
		expect(screen.getByText("Your booking, simplified.")).toBeInTheDocument()
		expect(
			screen.queryByRole("link", { name: /Sign in to Envoye/ }),
		).not.toBeInTheDocument()
		expect(
			screen.getByRole("button", { name: /Fahari Bookings/ }),
		).toBeDisabled()
		expect(screen.getByText("Book a group trip")).toBeInTheDocument()
		const contactUs = screen.getByRole("link", { name: /Contact Us/ })
		expect(contactUs).toHaveAttribute("href", "mailto:hellofahari@gmail.com")
		expect(contactUs).toHaveAttribute("target", "_blank")
	})
})
