import { useEffect, useState } from "react"
import { useFakeProgress } from "@/hooks/use-fake-progress.ts"
import { useNavigate, useSearch } from "@tanstack/react-router"
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty.tsx"
import { Spinner } from "@/components/ui/spinner.tsx"
import { Progress } from "@/components/ui/progress.tsx"
import { Pages } from "@/utils/pages.ts"

export function ExistingWorkspaceSetup() {
	const { code } = useSearch({ from: "/setup/workspace" })
	const [isCompleted, setIsCompleted] = useState(false)

	const navigate = useNavigate()
	const progress = useFakeProgress(isCompleted)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsCompleted(true)
			navigate({
				to: Pages.WORKSPACE,
				search: { code },
			}).then()
		}, 1000)
		return () => clearTimeout(timer)
	}, [code, navigate])

	return (
		<Empty className="w-full min-h-screen justify-center items-center">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Spinner />
				</EmptyMedia>
				<EmptyTitle>Setting up your workspace</EmptyTitle>
				<EmptyDescription>
					Please wait while we spin shit up for you...
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Progress value={progress} />
			</EmptyContent>
		</Empty>
	)
}
