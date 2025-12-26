import { Toaster } from "@/components/ui/sonner"
import JoinWaitListForm from "@/features/waitlist/components/join-form"

function WaitListPage() {
	return (

		<div
			className="min-h-screen  flex items-center"
			style={{
				background:
					"radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 120, 120, 0.15), transparent 50%), #ffffff",
			}}
		>
              <Toaster test-id="toaster" position="top-right" />
			<main className="mx-auto max-w-6xl  w-full">
				<div className="flex-1 gap-8  flex flex-col justify-center">
					<div>
						<h2 className="text-4xl tracking-tight">
							Creating a remarkable customer experience
						</h2>
						<p className="text-foreground/60 tracking-tight">
							{" "}
							Unify all your customer communications in one powerful inbox.{" "}
						</p>
					</div>

					<JoinWaitListForm />
				</div>
			</main>
		</div>
	)
}

export default WaitListPage
