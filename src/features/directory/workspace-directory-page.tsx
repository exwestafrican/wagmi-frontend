import TeamMemberCard from "@/features/directory/team-member-card.tsx"
import useTeammates from "@/features/directory/api/teammates.ts"
import { useSearch } from "@tanstack/react-router"
import { Loading } from "@/common/components/loading.tsx"
import { useFakeProgress } from "@/hooks/use-fake-progress.ts"
import WithErrorHandling from "@/common/with-error-handling.tsx"

export default function WorkspaceDirectoryPage() {
	const { code } = useSearch({ from: "/workspace/directory" })
	const { data: teammates, isPending, isError } = useTeammates(code)
	const progress = useFakeProgress(isPending)

	return (
		<div className="p-8 flex justify-start flex-col">
			<h1 className="text-2xl font-semibold mb-6">Directory</h1>
			{isPending && (
				<Loading text="Looking for other teammates..." progress={progress} />
			)}
			{!isPending && (
				<WithErrorHandling hasError={isError}>
					<div className="flex justify-stretch gap-5 flex-wrap">
						{teammates?.map((teammate) => (
							<TeamMemberCard key={teammate.id} teammate={teammate} />
						))}
					</div>
				</WithErrorHandling>
			)}
		</div>
	)
}
