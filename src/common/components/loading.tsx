import {
	Empty,
	EmptyContent,
	EmptyDescription,
} from "@/components/ui/empty.tsx"
import { Progress } from "@/components/ui/progress.tsx"

export function Loading({
	text,
	progress,
}: { text: string; progress: number }) {
	return (
		<Empty className="w-full min-h-screen justify-center items-center gap-0">
			<img
				src="/loading-bro.svg"
				alt="mail sent"
				className="mx-auto h-40% w-40% sm:h-140 sm:w-140 object-cover select-none"
				loading="eager"
			/>
			<EmptyContent>
				<Progress value={progress} />
			</EmptyContent>
			<EmptyDescription>{text}</EmptyDescription>
		</Empty>
	)
}
