import { Toaster } from "sileo"
import "sileo/styles.css"

export function BookingSuccessPage() {
	return (
		<main className="flex min-h-dvh items-center justify-center bg-white px-6 md:bg-[#FCFBF8]">
			<Toaster position="top-center" theme="light" />
			<div
				className="flex w-full max-w-sm flex-col items-center gap-4 text-center text-[#012420]"
				style={{ fontFamily: "Inter, sans-serif" }}
			>
				<h1 className="text-[40px] leading-none font-black tracking-tight">
					Your ride request is{" "}
					<span className="text-[#2f6a58]">successful</span>!
				</h1>
				<p className="text-sm leading-relaxed">
					Planning a group trip, an event, or managing a resort? Reach out to
					the team at{" "}
					<a
						href="mailto:humans@fahari.io"
						className="text-[#2f6a58] underline"
					>
						humans@fahari.io
					</a>
					. We'll be happy to work with you.
				</p>
			</div>
		</main>
	)
}
