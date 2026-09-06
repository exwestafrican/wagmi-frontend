import { Button } from "@common/components/ui/button.tsx"
import { FahariAdminPages } from "@fahari/constants.ts"
import { useVerifyOtp } from "@fahari/features/admin/check-email/api/otp.ts"
import {
	FahariOtpInput,
	type OtpInputHandle,
} from "@fahari/features/admin/check-email/otp-input.tsx"
import { AdminAuthLayout } from "@fahari/features/admin/components/admin-auth-layout.tsx"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { useRef } from "react"
import { toast } from "sonner"

const OTP_LENGTH = 6

export function AdminCheckEmailPage() {
	const navigate = useNavigate()
	const { email } = useSearch({ from: "/fahari/admin/check-email" })
	const { mutate: verifyOtp, isPending } = useVerifyOtp()
	const otpRef = useRef<OtpInputHandle>(null)

	const onSubmit = (otp: string) => {
		verifyOtp(
			{ otp, email },
			{
				onSuccess: (response) => {
					navigate({
						to: FahariAdminPages.BOOKINGS,
						hash: new URLSearchParams({
							access_token: response.data.accessToken,
						}).toString(),
					}).then()
				},
				onError: () => {
					toast.error("Invalid OTP", {
						description: "Please check the code and try again.",
					})
					otpRef.current?.clear()
				},
			},
		)
	}

	return (
		<AdminAuthLayout>
			<Button
				type="button"
				variant="ghost"
				onClick={() =>
					navigate({
						to: FahariAdminPages.LOGIN,
					})
				}
				className="mb-5 h-auto cursor-pointer gap-1 px-0 py-0 text-[11px] font-normal text-slate-400 shadow-none hover:bg-transparent hover:text-slate-700"
			>
				<ChevronLeft className="size-3" strokeWidth={2.5} />
				Back
			</Button>

			<h1 className="mb-1 text-base font-bold tracking-tight text-slate-900">
				Check your email
			</h1>
			<p className="mb-6 text-xs text-slate-400">
				Enter the 6-digit code sent to{" "}
				<span className="font-medium text-slate-600">{email}</span>.
			</p>

			<FahariOtpInput
				ref={otpRef}
				length={OTP_LENGTH}
				onSubmit={onSubmit}
				isPending={isPending}
			/>

			<button
				type="button"
				onClick={() => toast.success("Code sent")}
				className="mt-4 w-full cursor-pointer text-center text-[11px] text-slate-400 transition-colors hover:text-slate-700"
			>
				Resend code
			</button>
		</AdminAuthLayout>
	)
}
