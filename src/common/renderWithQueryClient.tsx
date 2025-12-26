import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render } from "@testing-library/react"

export default function renderWithQueryClient(component: React.ReactElement) {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
			mutations: {
				retry: false,
			},
		},
	})
	return {
		...render(
			<QueryClientProvider client={queryClient}>
				{component}
			</QueryClientProvider>,
		),
		queryClient,
	}
}
