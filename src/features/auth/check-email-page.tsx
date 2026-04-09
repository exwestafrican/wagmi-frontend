import { Pages } from "@/utils/pages.ts"
import { ChevronLeft } from "lucide-react"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { CHECK_MAIL_REASON } from "@/constants.ts"
import {Button} from "@/components/ui/button.tsx";

function LoginSuccessMessage({ email }: { email: string }) {
	return (
		<p className="mt-3 text-sm text-neutral-600 sm:text-base">
			We sent you a magic link to{" "}
			<span className="font-semibold text-neutral-900">{email}</span> so you can
			get into your workspace.
		</p>
	)
}

function SignupSuccessMessage({ email }: { email: string }) {
	return (
		<p className="mt-3 text-sm text-neutral-600 sm:text-base">
			We sent you a confirmation email to{" "}
			<span className="font-semibold text-neutral-900">{email}</span>. Follow
			the link inside to get started.
		</p>
	)
}

function InviteSuccessMessage({ email }: { email: string }) {
	return (
		<p className="mt-3 text-sm text-neutral-600 sm:text-base">
			We sent you a confirmation email to{" "}
			<span className="font-semibold text-neutral-900">{email}</span>. Follow
			the link to join the conversation.
		</p>
	)
}
export function CheckEmail() {
	const navigate = useNavigate()
	const { email, type } = useSearch({ from: "/check-email" })

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
					You've got mail!
				</h1>
				{renderMessage()}
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
						Resend Email
					</p>
				</Button>
			</div>
		</div>
	)
}
