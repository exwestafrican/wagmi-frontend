import { afterEach, beforeEach, vi } from "vitest"
import "@testing-library/jest-dom/vitest"

vi.mock("axios")

beforeEach(() => {
	localStorage.clear()
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
