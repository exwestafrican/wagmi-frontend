import { FahariAdminApiPaths } from "@fahari/constants.ts"
import { fahariAdminApiClient } from "@fahari/lib/fahari-admin-api-client.ts"
import { useMutation } from "@tanstack/react-query"

type OtpVerification = {
	otp: string
	email: string
}

export function useVerifyOtp() {
	return useMutation({
		mutationFn: (data: OtpVerification) => {
			return fahariAdminApiClient.post(FahariAdminApiPaths.VERIFY_OTP, data)
		},
	})
}
