import { QueryClientProvider } from "@tanstack/react-query"
import { renderHook, waitFor } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { apiClient } from "@common/lib/api-client"
import { ApiPaths } from "@envoye/constants.ts"
import { createTestQueryClient } from "@common/renderWithQueryClient"
import { useMarkAsRead } from "@envoye/features/conversation/hooks/use-mark-as-read.ts"

const mockApiClientPost = vi.mocked(apiClient.post)

function wrapper({ children }: { children: React.ReactNode }) {
	const queryClient = createTestQueryClient()
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
}

describe("useMarkAsRead", () => {
	beforeEach(() => {
		mockApiClientPost.mockResolvedValue({ data: {} })
	})

	test("POSTs mark-as-read when lastReadMessageId is set", async () => {
		renderHook(() => useMarkAsRead("antiworld", 12, 42), { wrapper })

		await waitFor(() => {
			expect(mockApiClientPost).toHaveBeenCalledWith(ApiPaths.MARK_AS_READ, {
				workspaceCode: "antiworld",
				conversationId: 12,
				lastReadMessageId: 42,
			})
		})
	})

	test("does not POST again when lastReadMessageId is unchanged", async () => {
		const { rerender } = renderHook(
			({ lastReadMessageId }) =>
				useMarkAsRead("antiworld", 12, lastReadMessageId),
			{
				initialProps: { lastReadMessageId: 42 },
				wrapper,
			},
		)

		await waitFor(() => {
			expect(mockApiClientPost).toHaveBeenCalledTimes(1)
		})

		rerender({ lastReadMessageId: 42 })

		expect(mockApiClientPost).toHaveBeenCalledTimes(1)
	})

	test("POSTs again when lastReadMessageId advances", async () => {
		const { rerender } = renderHook(
			({ lastReadMessageId }) =>
				useMarkAsRead("antiworld", 12, lastReadMessageId),
			{
				initialProps: { lastReadMessageId: 42 },
				wrapper,
			},
		)

		await waitFor(() => {
			expect(mockApiClientPost).toHaveBeenCalledTimes(1)
		})

		rerender({ lastReadMessageId: 55 })

		await waitFor(() => {
			expect(mockApiClientPost).toHaveBeenCalledTimes(2)
			expect(mockApiClientPost).toHaveBeenLastCalledWith(
				ApiPaths.MARK_AS_READ,
				{
					workspaceCode: "antiworld",
					conversationId: 12,
					lastReadMessageId: 55,
				},
			)
		})
	})

	test("does not POST when lastReadMessageId is undefined", () => {
		renderHook(() => useMarkAsRead("antiworld", 12, undefined), { wrapper })

		expect(mockApiClientPost).not.toHaveBeenCalled()
	})

	test("does not POST when conversationId is 0", () => {
		renderHook(() => useMarkAsRead("antiworld", 0, 42), { wrapper })

		expect(mockApiClientPost).not.toHaveBeenCalled()
	})
})
