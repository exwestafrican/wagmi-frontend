import {
	SidebarHeader,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar.tsx"
import { Sidebar } from "@/components/ui/sidebar"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { MoreVertical } from "lucide-react"
import { useSearch } from "@tanstack/react-router"
import { useWorkspace } from "@/features/workspace/api/workspace.ts"
import type { Workspace } from "@/features/workspace/interface/workspace.interface.ts"

export default function WorkspacePage() {
	//TODO load everything
	const { code, accessToken } = useSearch({ from: "/workspace" })
	const { data: workspaceDataResponse } = useWorkspace({ code, accessToken })
	const workspace = workspaceDataResponse?.data ?? ({} as Workspace)

	return (
		<SidebarProvider>
			<Sidebar>
				<SidebarHeader>
					<div className="flex items-center justify-between">
						<span className="text-gray-800 text-sm truncate">
							tumise.alade@useenvoye.com
						</span>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className="text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md px-1 py-1.5 transition-colors cursor-pointer">
									<MoreVertical size={18} strokeWidth={1.5} />
								</button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem
									className="text-xs cursor-pointer"
									onClick={() => {}}
								>
									Add Teammate
								</DropdownMenuItem>
								<DropdownMenuItem className="text-xs cursor-pointer">
									End Subscription
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</SidebarHeader>
			</Sidebar>
			<div className="relative flex min-h-svh w-full">
				<SidebarTrigger className="fixed top-4 right-4 z-50" />
				<div className="m-auto flex items-center justify-center">
					{`Welcome to ${workspace.name} workspace`}
				</div>
			</div>
		</SidebarProvider>
	)
}
