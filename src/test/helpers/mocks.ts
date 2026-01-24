import { AxiosError, type HttpStatusCode } from "axios"

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
