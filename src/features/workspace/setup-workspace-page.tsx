import WithErrorHandling from "@/common/with-error-handling.tsx"
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty.tsx"
import { Spinner } from "@/components/ui/spinner.tsx"
import { Progress } from "@/components/ui/progress"
import React from "react"

function getHashParams(key: string): string | null {
	const hash = window.location.hash.substring(1)
	const params = new URLSearchParams(hash)
	return params.get(key)
}
export default function SetupWorkspacePage() {
	const accessToken = getHashParams("access_token")
	const [progress, setProgress] = React.useState(10)

	React.useEffect(() => {
		const timer = setTimeout(
			() => setProgress(Math.min(progress + 10, 70)),
			500,
		)
		return () => clearTimeout(timer)
	}, [progress])

	return (
		<WithErrorHandling hasError={() => accessToken == null}>
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
		</WithErrorHandling>
	)
}
