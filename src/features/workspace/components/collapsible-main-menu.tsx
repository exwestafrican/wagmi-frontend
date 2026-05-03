import type {
	MenuItem,
	SubMenuItem,
} from "@/features/workspace/interface/menu.ts"
import useActivePath from "@/hooks/use-active-path.ts"
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible.tsx"
import {
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx"
import { ChevronDown } from "lucide-react"

export default function CollapsibleMainMenuItem({
	item,
	onClick,
}: {
	item: MenuItem
	onClick: (subMenuItem: SubMenuItem) => void
}) {
	const isActive = useActivePath()

	return (
		<Collapsible defaultOpen className="group/collapsible">
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton size="sm" className="cursor-pointer">
						<div className="flex gap-2 items-center text-muted-brown text-xs">
							<item.icon className="h-4 w-4" />
							<span className="text-left font-normal text-xs capitalize">
								{item.label}
							</span>
						</div>
						<ChevronDown className=" h-4 w-4 text-muted-brown  ml-auto transition-transform group-data-[state=closed]/collapsible:rotate-270" />
					</SidebarMenuButton>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<SidebarMenuSub>
						{item.subMenuItems.map((subMenuItem) => (
							<SidebarMenuSubItem key={subMenuItem.id}>
								<SidebarMenuSubButton
									size="sm"
									className="cursor-pointer capitalize"
									onClick={() => onClick(subMenuItem)}
									isActive={isActive(subMenuItem.path)}
								>
									{subMenuItem.label}
								</SidebarMenuSubButton>
							</SidebarMenuSubItem>
						))}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	)
}
