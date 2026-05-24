import { useNavigate } from "@tanstack/react-router"
import { useEffect, useMemo } from "react"
import { getHashParams } from "@/lib/get-hash-params.ts"
import { useAuthStore } from "@/stores/auth.store.ts"

export function AdminPage() {
	const navigate = useNavigate()
	const accessToken = useMemo(() => getHashParams("access_token"), [])
	const setAuthToken = useAuthStore((state) => state.setAuthToken)

	useEffect(() => {
		if (accessToken != null) {
			setAuthToken(accessToken)
		}
	}, [accessToken])

	const options = [
		{
			name: "feature flags",
			path: "/admin/feature-flag",
		},
		{
			name: "backfill",
			path: "/admin/backfill",
		},
	]
	return (
		<div className="m-8">
			<ul className="list-disc pl-6 space-y-1">
				{options.map((option) => (
					<li
						key={option.path}
						onClick={() =>
							navigate({
								to: option.path,
							})
						}
						className="capitalize cursor-pointer hover:text-blue-500 hover:underline"
					>
						{option.name}
					</li>
				))}
			</ul>
		</div>
	)
}
