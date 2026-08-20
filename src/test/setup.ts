import { afterEach, beforeEach, vi } from "vitest"
import "@testing-library/jest-dom/vitest"

// Node >= 25 injects a non-functional global `localStorage`/`sessionStorage`
// that shadows jsdom's implementation and lacks the Web Storage API (no
// `.clear`, `.getItem`, etc.). Install a memory-backed shim so the suite runs
// regardless of Node version.
class MemoryStorage implements Storage {
	private store = new Map<string, string>()
	get length() {
		return this.store.size
	}
	clear() {
		this.store.clear()
	}
	getItem(key: string) {
		return this.store.has(key) ? (this.store.get(key) as string) : null
	}
	key(index: number) {
		return Array.from(this.store.keys())[index] ?? null
	}
	removeItem(key: string) {
		this.store.delete(key)
	}
	setItem(key: string, value: string) {
		this.store.set(key, String(value))
	}
}

for (const name of ["localStorage", "sessionStorage"] as const) {
	if (typeof globalThis[name]?.clear !== "function") {
		Object.defineProperty(globalThis, name, {
			value: new MemoryStorage(),
			configurable: true,
			writable: true,
		})
	}
}

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

vi.mock("@tanstack/react-router-devtools", () => ({
	TanStackRouterDevtools: () => null,
}))

beforeEach(() => {
	localStorage.clear()
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
