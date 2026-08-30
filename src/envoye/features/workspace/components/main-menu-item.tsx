import type { MenuItem } from "@envoye/features/workspace/interface/menu.ts"
import useActivePath from "@common/hooks/use-active-path.ts"
import {
	SidebarMenuButton,
	SidebarMenuItem,
} from "@common/components/ui/sidebar.tsx"

export default function MainMenuItem({
	item,
	onClick,
}: { item: MenuItem; onClick: () => void }) {
	const isActive = useActivePath()
	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				className="cursor-pointer"
				size="sm"
				asChild
				onClick={onClick}
				isActive={!!item.path && isActive(item.path)}
			>
				<div>
					<div className="flex gap-2 items-center text-muted-brown">
						<item.icon className="h-4 w-4" />
						<span className="text-left font-normal text-xs capitalize">
							{item.label}
						</span>
					</div>
				</div>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}
