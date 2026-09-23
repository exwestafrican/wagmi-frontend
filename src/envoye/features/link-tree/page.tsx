import { Pages } from "@common/utils/pages.ts"
import { Link } from "@tanstack/react-router"

const CONTACT_EMAIL = "hellofahari@gmail.com"

export default function LinkTree() {
	return (
		<main
			className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f7f7f8] p-6"
			style={{ fontFamily: "'DM Sans', sans-serif" }}
		>
			<div className="mb-8 flex flex-col items-center gap-3">
				<div className="flex size-20 items-center justify-center rounded-full bg-[#228B22] shadow-md">
					<span className="text-2xl font-bold tracking-tight text-white">
						E
					</span>
				</div>
				<div className="text-center">
					<h1 className="text-base font-semibold text-foreground">Envoye</h1>
					<p className="mt-0.5 text-xs text-muted-foreground">
						Your workspace, simplified.
					</p>
				</div>
			</div>

			<div className="w-full max-w-sm space-y-3">
				<Link
					to={Pages.LOGIN}
					target="_blank"
					rel="noopener noreferrer"
					className="block w-full cursor-pointer rounded-xl bg-black px-4 py-3 text-left text-white shadow-sm transition-colors hover:bg-gray-900"
				>
					<p className="text-sm font-medium">Sign in to Envoye</p>
					<p className="mt-0.5 truncate text-xs text-white/60">
						Access your workspace and manage your workflows
					</p>
				</Link>

				<div className="relative">
					<button
						type="button"
						disabled
						className="w-full rounded-xl border border-border bg-white px-4 py-3 text-left opacity-60 disabled:cursor-not-allowed"
					>
						<p className="text-sm font-medium text-foreground">
							Fahari Bookings
						</p>
						<p className="mt-0.5 truncate text-xs text-muted-foreground">
							Book a ride from our fleets
						</p>
					</button>
					<span className="absolute -top-2 right-3 rounded-full bg-amber-400 px-1.5 py-0.5 text-[9px] font-semibold tracking-wide text-amber-900 uppercase">
						Coming soon
					</span>
				</div>

				<a
					href={`mailto:${CONTACT_EMAIL}`}
					target="_blank"
					rel="noopener noreferrer"
					className="block w-full rounded-xl border border-border bg-white px-4 py-3 transition-colors hover:border-gray-300 hover:text-foreground"
				>
					<p className="text-sm font-medium text-foreground">Contact Us</p>
					<p className="mt-0.5 truncate text-xs text-muted-foreground">
						Get in touch with our team
					</p>
				</a>
			</div>

			<p className="mt-10 text-[10px] text-muted-foreground">© 2026 Envoye</p>
		</main>
	)
}
