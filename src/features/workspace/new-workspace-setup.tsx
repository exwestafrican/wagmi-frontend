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
import { Progress } from "@/components/ui/progress.tsx"
import { useEffect, useMemo, useState } from "react"
import { useSetupWorkspace } from "@/features/workspace/api/setup-workspace.ts"
import { toast } from "sonner"
import { useNavigate, useParams } from "@tanstack/react-router"
import { Pages } from "@/utils/pages.ts"
import { WORKSPACE } from "@/features/workspace/api/workspace.ts"
import { useQueryClient } from "@tanstack/react-query"
import type { Workspace } from "@/features/workspace/interface/workspace.interface.ts"
import { useFakeProgress } from "@/hooks/use-fake-progress.ts"
import { useAuthStore } from "@/stores/auth.store.ts"
import { getHashParams } from "@/lib/get-hash-params.ts"

export default function NewWorkspaceSetup() {
	const accessToken = useMemo(() => getHashParams("access_token"), [])

	const [isCompleted, setIsCompleted] = useState(false)
	const [hasSetupError, setHasSetupError] = useState(false)

	const { mutate: setupWorkspace } = useSetupWorkspace()
	const setAuthToken = useAuthStore((state) => state.setAuthToken)

	const queryClient = useQueryClient()
	const navigate = useNavigate()
	const progress = useFakeProgress(isCompleted)

	const { preVerificationId } = useParams({
		from: "/setup/$preVerificationId/workspace",
	})

	useEffect(() => {
		setupWorkspace(preVerificationId, {
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
						search: { code: workspace.code },
					})
				}, 400)
			},
			onError: () => {
				toast.error("Failed to setup workspace")
				setHasSetupError(true)
			},
		})
	}, [preVerificationId, setupWorkspace, navigate, queryClient])

	useEffect(() => {
		if (!accessToken) return
		setAuthToken(accessToken)
	}, [accessToken, setAuthToken])

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
