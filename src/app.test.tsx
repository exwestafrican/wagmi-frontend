import { describe, expect, it } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import { RouterProvider } from "@tanstack/react-router"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@common/renderWithQueryClient.tsx"
import LanguageProvider from "@common/i18n/LanguageProvider.tsx"
import { createAppRouter } from "@/app-router.tsx"

describe("createAppRouter", () => {
	it("renders Fahari at /fahari", async () => {
		const queryClient = createTestQueryClient()
		const router = createAppRouter(queryClient)
		await router.navigate({ to: "/fahari" })

		renderWithQueryClient(
			<LanguageProvider>
				<RouterProvider router={router} context={{ queryClient }} />
			</LanguageProvider>,
			{ queryClient },
		)

		await waitFor(() => {
			expect(screen.getByRole("heading", { name: "Fahari" })).toBeInTheDocument()
		})
	})
})
