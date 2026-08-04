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

export function ExistingWorkspaceSetup() {
	const { code } = useSearch({ from: "/setup/workspace" })
	const accessToken = useMemo(() => useAuthStore.getState().token, [])
	const [isCompleted, setIsCompleted] = useState(false)

	const invalidLink = accessToken === null;

	const navigate = useNavigate()
	const { count, isFinished } = useCountDown(3)
	const progress = useFakeProgress(isCompleted)

	useEffect(() => {
		if (invalidLink) return
		// TODO load a bunch of things
		console.log('called', accessToken);
		const id = setTimeout(() => {
			setIsCompleted(true)
			navigate({
				to: Pages.WORKSPACE,
				search: { code: code },
			}).then()
		}, 1000)

		//in strict mode react renders component twice, this made the setTimeout call to be called twice
		//when the second call is triggered we have already navigated to workspaceLayout page, validated the token exists in the url and cleared from the hash param.
		//This second timeout function call triggers a new navigation again to the workspaceLayout page but when we check the url this time at onBeforeLoad of the workspaceLayout, the access_token is not present, causing redirect to login page.
		return () => clearTimeout(id);
	}, [accessToken, code, setIsCompleted, navigate])

	useEffect(() => {
		if (invalidLink && isFinished) {
			console.log("we are hitting here at some point, so token is getting invalidated")
			setIsCompleted(true)
			navigate({ to: Pages.LOGIN }).then()
		}
	}, [navigate, isFinished])

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
