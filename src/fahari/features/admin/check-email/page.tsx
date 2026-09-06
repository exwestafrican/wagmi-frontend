import { Button } from "@common/components/ui/button.tsx"
import {
	OtpInput,
	type OtpInputHandle,
} from "@common/components/ui/otp-input.tsx"
import { FahariAdminPages } from "@fahari/constants.ts"
import { AdminAuthLayout } from "@fahari/features/admin/components/admin-auth-layout.tsx"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { ChevronLeft } from "lucide-react"
import { useRef } from "react"
import { toast } from "sonner"

const OTP_LENGTH = 6

export function AdminCheckEmailPage() {
	const navigate = useNavigate()
	const { email } = useSearch({ from: "/fahari/admin/check-email" })
	const otpRef = useRef<OtpInputHandle>(null)

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

			<OtpInput
				ref={otpRef}
				className="w-full gap-4"
				length={OTP_LENGTH}
				onSubmit={() => undefined}
				isPending={false}
				inputClassName="h-auto w-full aspect-square rounded-md border border-slate-200 bg-transparent font-mono text-lg font-semibold text-slate-900 shadow-none hover:border-slate-300 focus-visible:border-slate-900 focus-visible:ring-0 sm:h-auto sm:w-full sm:text-lg"
				renderSubmit={({ disabled, onClick, isPending }) => (
					<Button
						type="button"
						disabled={disabled}
						onClick={onClick}
						className="h-auto w-full cursor-pointer rounded-md bg-slate-900 py-2.5 text-xs font-semibold text-white shadow-none hover:bg-black disabled:opacity-60"
					>
						{isPending ? "Verifying…" : "Verify & sign in"}
					</Button>
				)}
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
