import { AxiosError, type HttpStatusCode } from "axios"
import { faker } from "@faker-js/faker"
import { vi } from "vitest"
import { apiClient } from "@/lib/api-client"
import { useAuthStore } from "@/stores/auth.store"

export function mockError(statusCode: HttpStatusCode) {
	const code = "ERR_BAD_REQUEST"
	const axiosError = new AxiosError(
		`request failed with status code ${statusCode}`,
		code,
		undefined,
		{},
		undefined,
	)
	axiosError.status = statusCode
	axiosError.response = {
		status: statusCode,
		data: null,
		headers: {},
		config: {} as never,
		statusText: "",
	}
	return axiosError
}

export function mockFakeCode() {
	return faker.string.alpha({ length: 6, casing: "lower", exclude: ["i", "l"] })
}

export function mockAuthedUser(token = "fake-token") {
	useAuthStore.getState().setAuthToken(token)
}

export function mockGetUrls({ isAuthenticated = false } = {}) {
	if (isAuthenticated) mockAuthedUser()

	type RouteResult =
		| { ok: true; data: unknown }
		| { ok: false; status: HttpStatusCode }

	const routes = new Map<string, RouteResult>()

	const builder = {
		url(url: string) {
			return {
				respond(data: unknown) {
					routes.set(url, { ok: true, data })
					return builder
				},
				fail(status: HttpStatusCode) {
					routes.set(url, { ok: false, status })
					return builder
				},
			}
		},
		apply() {
			vi.mocked(apiClient.get).mockImplementation((url: string) => {
				const route = routes.get(url)
				if (!route) return Promise.reject(new Error(`Unexpected GET ${url}`))
				if (!route.ok) return Promise.reject(mockError(route.status))
				return Promise.resolve({ data: route.data })
			})
		},
	}

	return builder
}
