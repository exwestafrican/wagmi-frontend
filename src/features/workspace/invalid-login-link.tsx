import {
	Empty,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty.tsx"
import { Button } from "@/components/ui/button.tsx"

export function InvalidLoginLink({
	count,
	onclick,
}: { count: number; onclick: () => void }) {
	return (
		<Empty className="w-full min-h-screen justify-center items-center">
			<EmptyHeader className="max-w-5/6">
				<EmptyTitle>Yikes! Login link invalid or expired.</EmptyTitle>
				<EmptyMedia variant="icon">
					{count === 0 ? (
						<Button className="cursor-pointer" onClick={onclick}>
							Click here to redirect
						</Button>
					) : (
						<Button disabled={true}>{`Redirecting in ${count}s...`}</Button>
					)}
				</EmptyMedia>
			</EmptyHeader>
		</Empty>
	)
}
