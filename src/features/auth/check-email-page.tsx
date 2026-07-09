import { Pages } from "@/utils/pages.ts"
import { ChevronLeft } from "lucide-react"
import { useState } from "react"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { CHECK_MAIL_REASON } from "@/constants.ts"
import { Button } from "@/components/ui/button.tsx"
import { OtpInput } from "@/components/ui/otp-input.tsx"
import useVerifyOtp from "./api/otp"

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
	const [otp, setOtp] = useState("")
	const isComplete = otp.length === OTP_LENGTH
	const { mutate: verifyOtp } = useVerifyOtp()
	const search = useSearch({ strict: false })

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
	const onSubmit = () => {
		verifyOtp({ otp: otp, email: email }, {
			onSuccess: (response) => {
				console.log("OTP verified successfully:", response.data);
				if(search.redirect) {
					navigate({
						to: search.redirect,
					}).then()
				} else {
					navigate({
						to: Pages.SETUP_WORKSPACE,
						search: { code: response.data.workspaceCode},
						hash: new URLSearchParams({
							access_token: response.data.accessToken,
						}).toString(),
					}).then()
				}
			},
			onError: () => {
				// Handle error
			},
		})
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

				<div className="mt-8 flex flex-col items-center gap-6">
					<OtpInput
						length={OTP_LENGTH}
						value={otp}
						onChange={setOtp}
						autoFocus
					/>
					<Button
						size="lg"
						disabled={!isComplete}
						className="w-full cursor-pointer"
						onClick={() => onSubmit()}
					>
						Verify
					</Button>
				</div>
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
						Resend Code
					</p>
				</Button>
			</div>
		</div>
	)
}
