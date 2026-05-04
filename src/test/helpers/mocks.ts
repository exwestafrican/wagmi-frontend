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

	const routes = new Map<string, unknown>()

	const builder = {
		url(url: string) {
			return {
				respond(data: unknown) {
					routes.set(url, data)
					return builder
				},
			}
		},
		apply() {
			vi.mocked(apiClient.get).mockImplementation((url: string) => {
				if (routes.has(url)) return Promise.resolve({ data: routes.get(url) })
				return Promise.reject(new Error(`Unexpected GET ${url}`))
			})
		},
	}

	return builder
}
