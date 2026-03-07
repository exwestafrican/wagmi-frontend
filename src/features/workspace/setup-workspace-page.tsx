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
import {useCallback, useEffect, useState} from "react"
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
	const [hasSetupError, setHasSetupError] = useState(false)
	const [isWorkspaceSetupCompleted] = useState(false)

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

    const setupWorkspaceOnce = useCallback(() =>  {
		if (progress === INITIAL_PROGRESS) {
			setupWorkspace(
				{
					preverificationId: preVerificationId,
					accessToken: accessToken ?? "",
				},
				{
					onSuccess: (response) => {
						// load app => send app code return teammate details
						// load teammate => sendToken return teammate details
						// load permissions
						// load feature
						const workspace: Workspace = {
							code: response.data.code,
							name: response.data.name,
							status: response.data.status,
						}
						queryClient.setQueryData([WORKSPACE, workspace.code], {
							data: workspace,
						})
						setProgress(100)
						navigate({
							to: Pages.WORKSPACE,
							search: { code: workspace.code, accessToken: accessToken },
						})
					},
					onError: () => {
						toast.error("Failed to setup workspace")
						setHasSetupError(true)
					},
				},
			)
		}
	},[progress, setupWorkspace, preVerificationId, accessToken, queryClient, navigate])

    const moveProgressBar = useCallback(() => {
		return setTimeout(() => {
			if (progress < 70) {
				setProgress(Math.min(progress + 10, 70))
			} else if (progress >= 70 && !isWorkspaceSetupCompleted) {
				setProgress(Math.min(progress + 3, 90))
			} else {
				setProgress(100)
			}
		}, 500)
	}, []);

    useEffect(() => {
        setupWorkspaceOnce()
        //TODO set token
    }, [setupWorkspaceOnce])

	useEffect(() => {
		const progressTimer = setTimeout(() => {
			moveProgressBar()
		}, 500)

		return () => clearTimeout(progressTimer)
	}, [progress, moveProgressBar])

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
