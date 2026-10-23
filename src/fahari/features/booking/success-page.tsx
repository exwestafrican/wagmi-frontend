export function BookingSuccessPage() {
	return (
		<main className="flex min-h-dvh items-center justify-center bg-white px-6 md:bg-[#FCFBF8]">
			<div
				className="flex w-full max-w-sm flex-col items-center gap-4 text-center text-[#012420]"
				style={{ fontFamily: "Inter, sans-serif" }}
			>
				<h1 className="text-[40px] leading-none font-black tracking-tight">
					Your ride request is{" "}
					<span className="text-[#2f6a58]">successful</span>!
				</h1>
				<p className="text-sm leading-relaxed">
					We'll be in touch within 48 hours to confirm your booking and guide
					you through the payment process.
				</p>
				<p className="text-sm leading-relaxed font-semibold">
					Planning a group trip, hosting an event, or managing a resort?
				</p>
				<p className="text-sm leading-relaxed">
					We'd love to work with you. Reach out to us at{" "}
					<a
						href="mailto:humans@fahari.io"
						className="text-[#2f6a58] underline"
					>
						humans@fahari.io
					</a>
					.
				</p>
			</div>
		</main>
	)
}
