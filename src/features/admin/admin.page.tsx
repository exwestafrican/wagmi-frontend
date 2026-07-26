import { useNavigate } from "@tanstack/react-router"
import type { KeyboardEvent } from "react"
import { ENVOYE_WORKSPACE_CODE, Permissions } from "@/constants.ts"
import { usePermission } from "@/features/permission/api/permissions.ts"

export function AdminPage() {
	const navigate = useNavigate()
	const { data: permissions = [] } = usePermission(ENVOYE_WORKSPACE_CODE)

	const options = [
		{
			name: "feature flags",
			path: "/admin/feature-flag",
		},
		{
			name: "backfill",
			path: "/admin/backfill",
		},
		...(permissions.includes(Permissions.MANAGE_DEVICES)
			? [
					{
						name: "devices",
						path: "/admin/devices",
					},
				]
			: []),
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
						onKeyDown={(e: KeyboardEvent<HTMLLIElement>) => {
							// this does nothing for now, maybe we can use this to navigate
							e.preventDefault()
						}}
						className="capitalize cursor-pointer hover:text-blue-500 hover:underline"
					>
						{option.name}
					</li>
				))}
			</ul>
		</div>
	)
}
