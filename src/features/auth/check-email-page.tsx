import { Pages } from "@/utils/pages.ts"
import { ChevronLeft } from "lucide-react"
import { useRef } from "react"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { CHECK_MAIL_REASON } from "@/constants.ts"
import { Button } from "@/components/ui/button.tsx"
import { OtpInput, type OtpInputHandle } from "@/components/ui/otp-input.tsx"
import useVerifyOtp from "./api/otp"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth.store"

const OTP_LENGTH = 6

function LoginSuccessMessage({ email }: { email: string }) {
	return (
		<p className="mt-3 text-sm text-neutral-600 sm:text-base">
			We sent a 6-digit code to{" "}
			<span className="font-semibold text-neutral-900">{email}</span>. Enter it
			below to get into your workspace.
		</p>
	)
}

function SignupSuccessMessage({ email }: { email: string }) {
	return (
		<p className="mt-3 text-sm text-neutral-600 sm:text-base">
			We sent a 6-digit code to{" "}
			<span className="font-semibold text-neutral-900">{email}</span>. Enter it
			below to get started.
		</p>
	)
}

function InviteSuccessMessage({ email }: { email: string }) {
	return (
		<p className="mt-3 text-sm text-neutral-600 sm:text-base">
			We sent a 6-digit code to{" "}
			<span className="font-semibold text-neutral-900">{email}</span>. Enter it
			below to join the conversation.
		</p>
	)
}
export function CheckEmail() {
	const navigate = useNavigate()
	const { email, type } = useSearch({ from: "/check-email" })
	const { mutate: verifyOtp, isPending } = useVerifyOtp()
	const search = useSearch({ strict: false })
	const isUserLogin = type === CHECK_MAIL_REASON.LOGIN_SUCCESS
	const otpRef = useRef<OtpInputHandle>(null)
	const setAuthToken = useAuthStore((state) => state.setAuthToken)

	const renderMessage = () => {
		switch (type) {
			case CHECK_MAIL_REASON.LOGIN_SUCCESS:
				return <LoginSuccessMessage email={email} />
			case CHECK_MAIL_REASON.SIGNUP_SUCCESS:
				return <SignupSuccessMessage email={email} />
			case CHECK_MAIL_REASON.INVITE_ACCEPTED_SUCCESS:
				return <InviteSuccessMessage email={email} />
			default:
				return null
		}
	}

	const onSubmit = (otp: string) => {
		verifyOtp(
			{ otp, email },
			{
				onSuccess: (response) => {
					if (search.redirect) {
						setAuthToken(response.data.accessToken)
						navigate({
							to: search.redirect,
						}).then()
					} else {
						navigate({
							to: Pages.SETUP_WORKSPACE,
							search: { code: response.data.workspaceCode },
							hash: new URLSearchParams({
								access_token: response.data.accessToken,
							}).toString(),
						}).then()
					}
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
		<div className="flex flex-1 flex-col min-h-screen justify-center items-center px-6 py-10 sm:px-10 md:px-12 lg:px-14 gap-10">
			<div className="w-full max-w-md text-center">
				<img
					src="/mail-sent.svg"
					alt="mail sent"
					className="mx-auto mb-7 h-90 w-auto select-none sm:h-80"
					loading="eager"
				/>

				<h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
					Check your email
				</h1>
				{renderMessage()}

				{isUserLogin && (
					<OtpInput
						ref={otpRef}
						className="mt-8"
						length={OTP_LENGTH}
						onSubmit={onSubmit}
						isPending={isPending}
					/>
				)}
			</div>
			<div>
				<Button
					variant="ghost"
					onClick={() =>
						navigate({
							to: Pages.LOGIN,
						}).then()
					}
					className="flex items-center gap-0 cursor-pointer"
				>
					<ChevronLeft />
					<p className="font-medium tracking-tight text-neutral-900 ">
						{" "}
						Resend {isUserLogin ? "Code" : "Email"}
					</p>
				</Button>
			</div>
		</div>
	)
}
