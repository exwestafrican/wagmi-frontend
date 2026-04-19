import { Empty, EmptyContent } from "@/components/ui/empty.tsx"

export default function NotFound() {
	return (
		<Empty className="w-full min-h-screen justify-center items-center gap-0">
			<img
				src="/empty-page.svg"
				alt="mail sent"
				className="mx-auto h-40% w-40% sm:h-140 sm:w-140 object-cover select-none"
				loading="eager"
			/>
			<EmptyContent>Seems you're lost....</EmptyContent>
		</Empty>
	)
}
