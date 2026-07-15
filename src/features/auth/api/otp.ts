import { useMutation } from "@tanstack/react-query"
import { ApiPaths } from "@/constants"
import { apiClient } from "@/lib/api-client"
import type { OtpVerification } from "../interface/otp-verification"

export default function useVerifyOtp() {
	return useMutation({
		mutationFn: (data: OtpVerification) => {
			return apiClient.post(ApiPaths.VERIFY_OTP, data)
		},
	})
}
