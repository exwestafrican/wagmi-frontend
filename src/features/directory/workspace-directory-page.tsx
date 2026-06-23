import TeamMemberCard from "@/features/directory/team-member-card.tsx"
import TeamMemberCardMobile from "@/features/directory/team-member-card.mobile.tsx"
import useTeammates from "@/features/directory/api/teammates.ts"
import { useSearch } from "@tanstack/react-router"
import { Loading } from "@/common/components/loading.tsx"
import { useFakeProgress } from "@/hooks/use-fake-progress.ts"
import { useIsMobile } from "@/hooks/use-mobile.ts"
import WithErrorHandling from "@/common/with-error-handling.tsx"
import { Separator } from "@/components/ui/separator.tsx"

export default function WorkspaceDirectoryPage() {
	const { code } = useSearch({ from: "/workspace/directory" })
	const { data: teammates, isPending, isError } = useTeammates(code)
	const progress = useFakeProgress(isPending)
	const isMobile = useIsMobile()

	return (
		<div className="p-4 md:p-8 flex justify-start flex-col">
			<h1 className="text-2xl font-semibold mb-6">People</h1>
			{isPending && (
				<Loading text="Looking for other teammates..." progress={progress} />
			)}
			{!isPending && (
				<WithErrorHandling hasError={isError}>
					{isMobile ? (
						<div className="flex flex-col w-full gap-4">
							{teammates?.map((teammate, idx) => (
								<div className="flex flex-col gap-2">
									<TeamMemberCardMobile key={teammate.id} teammate={teammate} />
									{idx < teammates.length - 1 && (
										<Separator className="text-gray-500" />
									)}
								</div>
							))}
						</div>
					) : (
						<div className="flex justify-stretch gap-5 flex-wrap">
							{teammates?.map((teammate) => (
								<TeamMemberCard key={teammate.id} teammate={teammate} />
							))}
						</div>
					)}
				</WithErrorHandling>
			)}
		</div>
	)
}
