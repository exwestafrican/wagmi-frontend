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
import { useEffect, useState } from "react"
import { useSetupWorkspace } from "@/features/workspace/api/setup-workspace.ts"
import { toast } from "sonner"
import { useNavigate, useParams } from "@tanstack/react-router"
import { Pages } from "@/utils/pages.ts"
import { WORKSPACE } from "@/features/workspace/api/workspace.ts"
import { useQueryClient } from "@tanstack/react-query"
import type { Workspace } from "@/features/workspace/interface/workspace.interface.ts"

function getHashParams(key: string): string | undefined {
	const hash = window.location.hash.substring(1)
	const params = new URLSearchParams(hash)
	return params.get(key) ?? undefined
}
export default function SetupWorkspacePage() {
	const INITIAL_PROGRESS = 0

	const accessToken = getHashParams("access_token")

	const [progress, setProgress] = useState(INITIAL_PROGRESS)
	const [isCompleted, setIsCompleted] = useState(false)
	const [hasSetupError, setHasSetupError] = useState(false)

	const { mutate: setupWorkspace } = useSetupWorkspace()
	const queryClient = useQueryClient()
	const navigate = useNavigate()
	console.log(
		"user params",
		useParams({
			from: "/setup/$preVerificationId/workspace",
		}),
	)
	const { preVerificationId } = useParams({
		from: "/setup/$preVerificationId/workspace",
	})

	useEffect(() => {
		setupWorkspace(
			{
				preverificationId: preVerificationId,
				accessToken: accessToken ?? "",
			},
			{
				onSuccess: (response) => {
					const workspace: Workspace = {
						code: response.data.code,
						name: response.data.name,
						status: response.data.status,
					}

					queryClient.setQueryData([WORKSPACE, workspace.code], {
						data: workspace,
					})

					setIsCompleted(true)

					setTimeout(() => {
						navigate({
							to: Pages.WORKSPACE,
							search: { code: workspace.code, accessToken },
						})
					}, 400)
				},
				onError: () => {
					toast.error("Failed to setup workspace")
					setHasSetupError(true)
				},
			},
		)
	}, [accessToken, preVerificationId, setupWorkspace, navigate, queryClient])

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (isCompleted) return 100

				if (prev < 30) return prev + 8
				if (prev < 60) return prev + 4
				if (prev < 85) return prev + 2
				if (prev < 95) return prev + 0.5

				return prev
			})
		}, 400)

		return () => clearInterval(interval)
	}, [isCompleted])

	return (
		<WithErrorHandling hasError={() => accessToken == null || hasSetupError}>
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
