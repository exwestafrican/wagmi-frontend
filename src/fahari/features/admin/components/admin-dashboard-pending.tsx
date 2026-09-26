import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@common/components/ui/empty.tsx"
import { Progress } from "@common/components/ui/progress.tsx"
import { Spinner } from "@common/components/ui/spinner.tsx"
import { useFakeProgress } from "@common/hooks/use-fake-progress.ts"

export function AdminDashboardPending() {
	const progress = useFakeProgress(false)

	return (
		<Empty className="w-full min-h-screen justify-center items-center">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Spinner />
				</EmptyMedia>
				<EmptyTitle>Loading your profile</EmptyTitle>
				<EmptyDescription>Setting up your admin dashboard...</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Progress value={progress} />
			</EmptyContent>
		</Empty>
	)
}
