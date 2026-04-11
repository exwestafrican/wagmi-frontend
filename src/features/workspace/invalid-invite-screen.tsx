import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import { Pages } from "@/utils/pages"

export function InvalidInviteScreen() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-6 py-12">
			<img
				src="/expired.svg"
				alt=""
				className=" size-full object-fit max-h-52"
			/>
			<div className="flex w-full max-w-md flex-col items-center text-center">
				<h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900 sm:text-[1.75rem]">
					Ooops!!
				</h1>
				<p className="mt-3 max-w-sm text-base text-neutral-500">
					This invitation has expired or is invalid.
				</p>
				<Button
					asChild
					variant="secondary"
					size="lg"
					className="mt-8 h-11 rounded-xl px-8 text-neutral-900 shadow-none"
				>
					<Link to={Pages.SIGNUP} data-testid="invalid-invite-continue">
						Continue to Home
					</Link>
				</Button>
			</div>
		</div>
	)
}
