import { useFakeProgress } from "@common/hooks/use-fake-progress.ts"
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@common/components/ui/empty.tsx"
import { Spinner } from "@common/components/ui/spinner.tsx"
import { Progress } from "@common/components/ui/progress.tsx"

export function WorkspacePending() {
	const progress = useFakeProgress(false)

	return (
		<Empty className="w-full min-h-screen justify-center items-center">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Spinner />
				</EmptyMedia>
				<EmptyTitle>Loading your stuff</EmptyTitle>
				<EmptyDescription>
					Setting up workspace, profile, and conversations...
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Progress value={progress} />
			</EmptyContent>
		</Empty>
	)
}
