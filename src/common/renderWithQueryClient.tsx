import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render } from "@testing-library/react"

export function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
			mutations: {
				retry: false,
			},
		},
	})
}

export default function renderWithQueryClient(
	component: React.ReactElement,
	options: { queryClient?: QueryClient } = {},
) {
	const { queryClient: customQueryClient } = options
	const queryClient = customQueryClient || createTestQueryClient()
	return {
		...render(
			<QueryClientProvider client={queryClient}>
				{component}
			</QueryClientProvider>,
		),
		queryClient,
	}
}
