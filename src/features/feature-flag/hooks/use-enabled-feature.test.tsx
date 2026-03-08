import { QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import { apiClient } from "@/lib/api-client"
import { describe, expect, test, vi } from "vitest"
import { createTestQueryClient } from "@/common/renderWithQueryClient"
import { useEnabledFeature } from "@/features/feature-flag/hooks/use-enabled-feature"

const mockApiClientGet = vi.mocked(apiClient.get)

function wrapper({ children }: { children: React.ReactNode }) {
	const queryClient = createTestQueryClient()
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
}

describe("useEnabledFeature", () => {
	test("returns isLoading true while fetching", () => {
		mockApiClientGet.mockReturnValue(new Promise(() => {}))

		const { result } = renderHook(
			() => useEnabledFeature("workspace-123", "can_integrate_whatsapp"),
			{ wrapper: wrapper },
		)

		expect(result.current.isLoading).toBe(true)
		expect(result.current.isEnabled).toBe(false)
	})

	test("returns isEnabled true when the feature key is in the enabled list", async () => {
		mockApiClientGet.mockResolvedValueOnce({
			data: ["can_integrate_whatsapp", "can_integrate_gmail"],
		})

		const { result } = renderHook(
			() => useEnabledFeature("workspace-123", "can_integrate_whatsapp"),
			{ wrapper: wrapper },
		)

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false)
			expect(result.current.isEnabled).toBe(true)
		})
	})

	test("returns isEnabled false when the feature key is not in the enabled list", async () => {
		mockApiClientGet.mockResolvedValueOnce({ data: ["can_integrate_gmail"] })

		const { result } = renderHook(
			() => useEnabledFeature("workspace-123", "can_integrate_whatsapp"),
			{ wrapper: wrapper },
		)

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false)
			expect(result.current.isEnabled).toBe(false)
		})
	})

	test("returns isEnabled false when the enabled list is empty", async () => {
		mockApiClientGet.mockResolvedValueOnce({ data: [] })

		const { result } = renderHook(
			() => useEnabledFeature("workspace-123", "can_integrate_whatsapp"),
			{ wrapper: wrapper },
		)

		await waitFor(() => {
			expect(result.current.isLoading).toBe(false)
			expect(result.current.isEnabled).toBe(false)
		})
	})
})
