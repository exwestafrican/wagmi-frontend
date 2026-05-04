import type { LucideIcon } from "lucide-react"

export type MenuItem = {
	id: string
	path?: string
	icon: LucideIcon
	label: string
	canView: boolean
	subMenuItems: SubMenuItem[]
}

export type SubMenuItem = {
	id: string
	path: string
	label: string
}
