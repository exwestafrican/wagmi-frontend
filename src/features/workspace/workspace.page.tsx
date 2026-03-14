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
import { useIsMobile } from "@/hooks/use-mobile.ts"
import { TeammateInviteModal } from "@/features/workspace/invite-teammate.tsx"
import { useState } from "react"

export default function WorkspacePage() {
	const [openTeammateInviteModal, setOpenTeammateInviteModal] = useState(false)
	const { code } = useSearch({ from: "/workspace" })
	const { data: workspaceDataResponse } = useWorkspace(code)
	const isMobile = useIsMobile()

	const workspace = workspaceDataResponse?.data ?? ({} as Workspace) //TODO we should have workspace before here

	return (
		<div>
			<TeammateInviteModal
				open={openTeammateInviteModal}
				onOpenChange={setOpenTeammateInviteModal}
			/>
			<SidebarProvider>
				<Sidebar>
					<SidebarHeader>
						<div className="flex items-center justify-between">
							<span className="text-gray-800 text-sm truncate">
								tumise.alade@useenvoye.com
							</span>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<button
										type="button"
										className="text-gray-600 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md px-1 py-1.5 transition-colors cursor-pointer"
									>
										<MoreVertical size={18} strokeWidth={1.5} />
									</button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-48">
									<DropdownMenuItem
										className="text-xs cursor-pointer"
										onClick={() => setOpenTeammateInviteModal(true)}
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
					{isMobile && <SidebarTrigger className="fixed top-4 right-4 z-50" />}

					<div className="m-auto flex items-center justify-center">
						{`Welcome to ${workspace.name} workspace`}
					</div>
				</div>
			</SidebarProvider>
		</div>
	)
}
