import { afterEach, beforeEach, vi } from "vitest"
import "@testing-library/jest-dom/vitest"

function createMemoryStorage(): Storage {
	const store = new Map<string, string>()
	return {
		get length() {
			return store.size
		},
		clear() {
			store.clear()
		},
		getItem(key) {
			return store.get(key) ?? null
		},
		key(index) {
			return [...store.keys()][index] ?? null
		},
		removeItem(key) {
			store.delete(key)
		},
		setItem(key, value) {
			store.set(key, String(value))
		},
	}
}

const memoryStorage = createMemoryStorage()

Object.defineProperty(globalThis, "localStorage", {
	value: memoryStorage,
	configurable: true,
	writable: true,
})

Object.defineProperty(window, "localStorage", {
	value: memoryStorage,
	configurable: true,
	writable: true,
})

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
	localStorage?.clear?.()
	window.location.hash = ""
	window.HTMLElement.prototype.scrollIntoView = vi.fn()
	window.scrollTo = vi.fn()
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
