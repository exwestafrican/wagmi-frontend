import renderWithQueryClient, {
	createTestQueryClient,
} from "@common/renderWithQueryClient.tsx"
import type { QueryClient } from "@tanstack/react-query"
import { vi } from "vitest"
import { RouterProvider } from "@tanstack/react-router"
import LanguageProvider from "@common/i18n/LanguageProvider.tsx"
import { createAppRouter } from "@/app-router.tsx"

export function makeAppTestRouter(queryClient: QueryClient) {
	return createAppRouter(queryClient)
}

export function makeAuthTestRouter(queryClient: QueryClient) {
	return makeAppTestRouter(queryClient)
}

export function makeTestRouter(queryClient: QueryClient) {
	return makeAppTestRouter(queryClient)
}

export async function navigateToTestPage({
	to,
	search,
	hash,
	seedQueryCache,
}: {
	to: string
	search: Record<string, string | number>
	hash?: string
	seedQueryCache?: (queryClient: QueryClient) => void
}) {
	const queryClient = createTestQueryClient()
	seedQueryCache?.(queryClient)
	const router = makeTestRouter(queryClient)
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
