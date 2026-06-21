import { afterEach, beforeEach, vi } from "vitest"
import "@testing-library/jest-dom/vitest"

vi.mock("@/lib/api-client", () => ({
	apiClient: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	},
}))

vi.mock("@/lib/admin-api-client", () => ({
	adminApiClient: {
		get: vi.fn(),
		post: vi.fn(),
		put: vi.fn(),
		patch: vi.fn(),
		delete: vi.fn(),
	},
}))

beforeEach(() => {
	localStorage.clear()
	window.location.hash = ""
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
})

afterEach(() => {
	vi.clearAllMocks()
})

// Mock window.matchMedia: window.matchMedia isn't available in the test environment. Sonner uses it for theme detection. Checking the test file and adding a mock:
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
})

globalThis.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}))
