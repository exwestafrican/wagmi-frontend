import { useEffect, useMemo, useState } from "react"
import { useFakeProgress } from "@/hooks/use-fake-progress.ts"
import { useNavigate, useSearch } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/auth.store.ts"
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
import { useCountDown } from "@/hooks/user-countdown.ts"
import { InvalidLoginLink } from "@/features/workspace/invalid-login-link.tsx"
import { getHashParams } from "@/lib/get-hash-params.ts"

export function ExistingWorkspaceSetup() {
	const { code } = useSearch({ from: "/setup/workspace" })
	const accessToken = useMemo(() => getHashParams("access_token"), [])
	const [isCompleted, setIsCompleted] = useState(false)

	const setAuthToken = useAuthStore((state) => state.setAuthToken)

	const navigate = useNavigate()
	const { count, isFinished } = useCountDown(3)
	const progress = useFakeProgress(isCompleted)

	useEffect(() => {
		if (invalidLink) return
		setAuthToken(accessToken ?? "")
		// TODO load a bunch of things
		setTimeout(() => {
			setIsCompleted(true)
			navigate({
				to: Pages.WORKSPACE,
				search: { code: code },
			}).then()
		}, 1000)
	}, [accessToken, setAuthToken, code, navigate])

	useEffect(() => {
		if (invalidLink && isFinished) {
			setTimeout(() => {
				setIsCompleted(true)
				navigate({ to: Pages.LOGIN }).then()
			}, 1000)
		}
	}, [code, navigate, isFinished])

	const invalidLink = useMemo(() => {
		return accessToken == null
	}, [accessToken])

	return invalidLink ? (
		<InvalidLoginLink
			count={count}
			onclick={() => navigate({ to: Pages.LOGIN })}
		/>
	) : (
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
