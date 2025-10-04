import { describe, expect, test, vi, beforeEach } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import {
	QueryClient,
	QueryClientProvider,
	type UseQueryResult,
} from "@tanstack/react-query"
import UploadPage from "@/features/file-upload/upload-page"
import type { StatementFile } from "@/features/file-upload/types/statementFile"

// Mock the usePostStatement hook
const mockMutate = vi.fn()
vi.mock("@/features/file-upload/api/usePostStatement", () => ({
	usePostStatement: () => ({
		mutate: mockMutate,
		isPending: false,
		isError: false,
		error: null,
	}),
}))

// Mock useQuery hook
vi.mock("@tanstack/react-query", async () => {
	const actual = await vi.importActual("@tanstack/react-query")
	return {
		...actual,
		useQuery: vi.fn(),
	}
})

describe("UploadPage", () => {
	// Helper function to create a complete useQuery mock
	function createUseQueryMock(data: StatementFile[]) {
		return {
			data,
			isLoading: false,
			isError: false,
			isPending: false,
			isSuccess: true,
			error: null,
			isLoadingError: false,
			isRefetchError: false,
			isFetching: false,
			isRefetching: false,
			isStale: false,
			isPlaceholderData: false,
			isPaused: false,
			isEnabled: true,
			status: "success",
			fetchStatus: "idle",
			errorUpdateCount: 0,
			errorUpdatedAt: 0,
			failureCount: 0,
			failureReason: null,
			isFetched: true,
			isFetchedAfterMount: true,
			isInitialLoading: false,
			dataUpdatedAt: Date.now(),
			refetch: vi.fn(),
			remove: vi.fn(),
			promise: Promise.resolve(data),
		} as UseQueryResult<StatementFile[], unknown>
	}

	// Helper function to mock useQuery with data
	async function mockUseQueryWith(data: StatementFile[]) {
		const { useQuery } = await import("@tanstack/react-query")
		vi.mocked(useQuery).mockReturnValue(createUseQueryMock(data))
	}

	// Helper function to upload a file
	async function uploadFile(user: UserEvent, file: File) {
		const fileInput = document.getElementById("file-upload") as HTMLInputElement
		await user.upload(fileInput, file)
	}

	beforeEach(async () => {
		// Reset all mocks before each test
		vi.clearAllMocks()

		// Default mock for useQuery - returns empty array
		await mockUseQueryWith([])
	})

	// Create a test wrapper with QueryClient
	function renderWithQueryClient(component: React.ReactElement) {
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

	function createMockFile(name: string, content: string) {
		return new File([content], name, {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		})
	}

	test("user can upload one file", async () => {
		const user = userEvent.setup()

		// Mock useQuery to return a file after upload
		await mockUseQueryWith([
			{
				id: "mock-id-123",
				name: "test.xlsx",
				size: 12,
			},
		])

		renderWithQueryClient(<UploadPage />)

		// Create a mock Excel file
		const mockFile = createMockFile("test.xlsx", "test content")

		// Upload file using helper function
		await uploadFile(user, mockFile)

		// Verify the mutation was called
		expect(mockMutate).toHaveBeenCalledWith(mockFile)

		// Verify file appears in the UI
		expect(screen.getByText("test.xlsx")).toBeDefined()
	})

	test("uploading an extra file overwrites previous upload", async () => {
		const user = userEvent.setup()
		const firstMockFile = createMockFile("first-test.xlsx", "test content")
		const secondMockFile = createMockFile("second-test.xlsx", "test content")

		// Test first upload
		await mockUseQueryWith([
			{
				id: "mock-id-first",
				name: "first-test.xlsx",
				size: 12,
			},
		])

		renderWithQueryClient(<UploadPage />)

		// Upload first file
		await uploadFile(user, firstMockFile)

		// Verify first mutation was called
		expect(mockMutate).toHaveBeenCalledWith(firstMockFile)

		// Verify first file appears
		expect(screen.getByText(firstMockFile.name)).toBeDefined()
		expect(screen.queryByText(secondMockFile.name)).toBeNull()

		// Test second upload with new mock data
		await mockUseQueryWith([
			{
				id: "mock-id-second",
				name: "second-test.xlsx",
				size: 12,
			},
		])

		// Upload second file (should overwrite first)
		await uploadFile(user, secondMockFile)

		// Verify second mutation was called
		expect(mockMutate).toHaveBeenCalledWith(secondMockFile)

		// Verify mutations were called twice
		expect(mockMutate).toHaveBeenCalledTimes(2)
	})

	test("user cannot upload file exceeding size limit", async () => {
		const user = userEvent.setup()
		renderWithQueryClient(<UploadPage />)

		// Create a mock file that's larger than MAX_UPLOAD_SIZE (3MB)
		const largeMockFile = createMockFile("large-file.xlsx", "test content")

		// Mock the file size to be larger than 3MB
		Object.defineProperty(largeMockFile, "size", {
			value: 5 * 1024 * 1024, // 5MB
			writable: false,
		})

		// Upload file using helper function
		await uploadFile(user, largeMockFile)

		// Wait a bit to ensure processing is complete
		await new Promise((resolve) => setTimeout(resolve, 100))

		// Verify file does NOT appear in the UI
		expect(screen.queryByText("large-file.xlsx")).toBeNull()

		// Verify mutation was NOT called for invalid file
		expect(mockMutate).not.toHaveBeenCalled()
	})
})
