import { Skeleton } from "@/components/ui/skeleton"
import {
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuBadge,
	SidebarMenuItem,
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

import {
	AtSign,
	Bell,
	BellDot,
	MessageCircle,
	MessageSquare,
	MoreVertical,
	UserCheck,
	Users,
} from "lucide-react"
import { useSearch } from "@tanstack/react-router"
import { useCurrentTeammate } from "@/features/workspace/api/current-teammate.ts"
import { useWorkspace } from "@/features/workspace/api/workspace.ts"
import type { Workspace } from "@/features/workspace/interface/workspace.interface.ts"
import { useIsMobile } from "@/hooks/use-mobile.ts"
import { TeammateInviteModal } from "@/features/workspace/invite-teammate.tsx"
import { type ReactNode, useState } from "react"
import { modifyCasing } from "@/utils/sentence-case.ts"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils.ts"
import { Empty, EmptyContent } from "@/components/ui/empty.tsx"

type SideNavWithSeparatorProp = {
	className?: string
	children: ReactNode
}

function Text({
	value,
	casing,
	className,
}: { value?: string; casing?: string; className?: string }) {
	if (value) {
		const modified = modifyCasing(value, casing ?? "regular")
		return <span className={className}>{modified}</span>
	}
	return <Skeleton className="h-4 w-full" />
}

function SideNavGroupWithTopSeparator({
	className,
	children,
}: SideNavWithSeparatorProp) {
	return (
		<>
			<Separator style={{ height: "2px", backgroundColor: "#e5e5e5" }} />
			<SidebarGroup className={cn(className, "px-2", "py-0")}>
				<SidebarGroupContent>{children}</SidebarGroupContent>
			</SidebarGroup>
		</>
	)
}

function WorkspaceAvatar({ workspace }: { workspace: Workspace }) {
	if (workspace.name) {
		return (
			<div className="w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold bg-[#c15f3c] text-[#333333]">
				{workspace.name[0].toUpperCase()}
			</div>
		)
	}
	return <div className="w-8 h-8 rounded-md bg-neutral-200/70 animate-pulse" />
}

export default function WorkspacePage() {
	const [openTeammateInviteModal, setOpenTeammateInviteModal] = useState(false)
	const [selectedTab, setSelectedTab] = useState("directory")
	const { code } = useSearch({ from: "/workspace" })
	const { data: workspaceDataResponse } = useWorkspace(code)
	const { data: teammate } = useCurrentTeammate(code)
	const isMobile = useIsMobile()

	const workspace = workspaceDataResponse?.data ?? ({} as Workspace) //TODO we should have workspace before here

	const mainMenuItems = [
		{ id: "directory", icon: Users, label: "Directory" },
		{ id: "activity", icon: Bell, label: "Activity" },
		{ id: "conversation", icon: MessageCircle, label: "Conversation" },
	]

	const supportMenuItems = [
		{ id: "dms", icon: BellDot, label: "DMs", count: "10+" },
		{ id: "assigned", icon: UserCheck, label: "Assigned", count: "5" },
		{ id: "mentioned", icon: AtSign, label: "Mentioned", count: "1" },
		{
			id: "discussion",
			icon: MessageSquare,
			label: "Discussions",
			count: undefined,
		},
	]


    const isActiveTab = (tabId: string): boolean => {
        return selectedTab === tabId
    }

	return (
		<div>
			<TeammateInviteModal
				open={openTeammateInviteModal}
				onOpenChange={setOpenTeammateInviteModal}
			/>
			<SidebarProvider>
				<Sidebar>
					<SidebarHeader className="p-3">
						<div className="flex items-center justify-between gap-2 min-w-0">
							<div className="text-gray-800 text-sm truncate min-w-0 flex-1">
								<div className="flex items-center gap-2">
									<WorkspaceAvatar workspace={workspace} />
									<div className="flex flex-col gap-0 flex-1">
										<Text
											className="text-sm font-semibold bg-#2d2c28"
											value={workspace.name}
											casing="sentence-case"
										/>
										<Text
											className="text-xs bg-#5a5854"
											value={teammate?.username}
										/>
									</div>
								</div>
							</div>
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
					<SidebarContent>
						<SideNavGroupWithTopSeparator>
							<SidebarMenu className="px-3">
								{mainMenuItems.map((item) => (
									<SidebarMenuItem
										onClick={() => setSelectedTab(item.id)}
										key={item.id}
										className={`sidebar-menu-item ${isActiveTab(item.id) && 'bg-sidebar-active'}`}
									>
										<item.icon className="h-4 w-4 " />
										<span className="text-left font-normal text-xs ">
											{item.label}
										</span>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SideNavGroupWithTopSeparator>
						<SideNavGroupWithTopSeparator>
							<SidebarGroupLabel className="sidebar-group-layout">
								support
							</SidebarGroupLabel>
							<SidebarMenu className="px-3">
								{supportMenuItems.map((item) => (
									<SidebarMenuItem
										onClick={() => setSelectedTab(item.id)}
										key={item.id}
										className={"sidebar-menu-item"}
									>
										<item.icon className="h-4 w-4 " />
										<span className="text-left font-normal text-xs ">
											{item.label}
										</span>

										{item.count && (
											<SidebarMenuBadge>
												<span className="text-xs px-1.5 py-0.5 rounded-full bg-chestnut-brown text-stone-100">
													{item.count}
												</span>
											</SidebarMenuBadge>
										)}
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SideNavGroupWithTopSeparator>
						<SideNavGroupWithTopSeparator>
							<SidebarGroupLabel className="sidebar-group-layout">
								direct messages
							</SidebarGroupLabel>
						</SideNavGroupWithTopSeparator>
					</SidebarContent>
				</Sidebar>
				<div className="relative flex min-h-svh w-full">
					{isMobile && <SidebarTrigger className="fixed top-4 right-4 z-50" />}
					<Empty className="w-full min-h-screen justify-center items-center gap-0">
						<img
							src="/empty-page.svg"
							alt="mail sent"
							className="mx-auto h-40% w-40% sm:h-140 sm:w-140 object-cover select-none"
							loading="eager"
						/>
						<EmptyContent>Nothing to see here</EmptyContent>
					</Empty>
				</div>
			</SidebarProvider>
		</div>
	)
}
