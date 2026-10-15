import { Spinner } from "@common/components/ui/spinner.tsx"

export function BookingPending() {
	return (
		<main className="flex min-h-dvh items-center justify-center bg-white md:bg-[#FCFBF8]">
			<Spinner className="size-8" />
		</main>
	)
}
