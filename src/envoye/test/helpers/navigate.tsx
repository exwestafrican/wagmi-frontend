import { createAppRouter } from "@/app-router.tsx"
import type { Product } from "@common/hooks/use-product-branding.ts"
import LanguageProvider from "@common/i18n/LanguageProvider.tsx"
import renderWithQueryClient, {
	createTestQueryClient,
} from "@common/renderWithQueryClient.tsx"
import type { QueryClient } from "@tanstack/react-query"
import { RouterProvider } from "@tanstack/react-router"
import { vi } from "vitest"

export function makeAppTestRouter(queryClient: QueryClient, product?: Product) {
	return product
		? createAppRouter(queryClient, product)
		: createAppRouter(queryClient)
}

export function makeAuthTestRouter(queryClient: QueryClient) {
	return makeAppTestRouter(queryClient)
}

export function makeTestRouter(queryClient: QueryClient, product?: Product) {
	return makeAppTestRouter(queryClient, product)
}

export async function navigateToTestPage({
	to,
	search,
	hash,
	seedQueryCache,
	product,
}: {
	to: string
	search: Record<string, string | number>
	hash?: string
	seedQueryCache?: (queryClient: QueryClient) => void
	product?: Product
}) {
	const queryClient = createTestQueryClient()
	seedQueryCache?.(queryClient)
	const router = makeTestRouter(queryClient, product)
	const navigateSpy = vi.spyOn(router, "navigate") // spy BEFORE render

	if (Object.values(search).length > 0) {
		await router.navigate({ to, search, hash })
	} else {
		await router.navigate({ to, hash })
	}
	renderWithQueryClient(
		<LanguageProvider>
			<RouterProvider router={router} context={{ queryClient }} />
		</LanguageProvider>,
		{ queryClient },
	)
	return { router, navigateSpy, queryClient }
}
