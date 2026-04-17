import { AxiosError, type HttpStatusCode } from "axios"
import { faker } from "@faker-js/faker"

export function mockError(statusCode: HttpStatusCode) {
	const code = "ERR_BAD_REQUEST"
	const axiosError = new AxiosError(
		"request failed with status code 401",
		code,
		undefined,
		{},
		undefined,
	)
	axiosError.status = statusCode
	return axiosError
}

export function mockFakeCode() {
	return faker.string.alpha({ length: 6, casing: "lower", exclude: ["i", "l"] })
}
