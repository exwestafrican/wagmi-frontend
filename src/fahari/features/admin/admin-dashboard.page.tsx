import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarSeparator,
	SidebarTrigger,
} from "@common/components/ui/sidebar.tsx"
import useActivePath from "@common/hooks/use-active-path.ts"
import { useIsMobile } from "@common/hooks/use-mobile.ts"
import { FahariAdminPages } from "@fahari/constants.ts"
import { Outlet, useNavigate } from "@tanstack/react-router"
import { CalendarDays } from "lucide-react"
import type { CSSProperties } from "react"

const HARDCODED_ADMIN = {
	name: "Admin",
	email: "admin@company.io",
	initial: "A",
} as const

const fahariSidebarStyle = {
	"--sidebar-width": "14rem",
	"--sidebar": "#f5f4f0",
	"--sidebar-accent": "#dbded3",
	"--sidebar-accent-foreground": "#2d3a1e",
	"--sidebar-border": "#e4e2dc",
} as CSSProperties

const mainMenuItems = [
	{
		id: "bookings",
		path: FahariAdminPages.BOOKINGS,
		icon: CalendarDays,
		label: "Bookings",
	},
]

export default function AdminDashboardPage() {
	const isMobile = useIsMobile()
	const navigate = useNavigate()
	const isActivePath = useActivePath()

	return (
		<div>
			<SidebarProvider style={fahariSidebarStyle}>
				<Sidebar>
					<SidebarHeader className="items-center p-3">
						<img
							src="/fahari-wordmark.svg"
							alt="Fahari"
							className="h-6 w-auto select-none"
						/>
					</SidebarHeader>
					<SidebarContent>
						<SidebarGroup className="px-2 py-0">
							<SidebarGroupLabel className="px-5 text-[10px] font-semibold tracking-widest text-[#999] uppercase">
								Management
							</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu className="px-3">
									{mainMenuItems.map((item) => {
										const active = isActivePath(item.path)
										return (
											<SidebarMenuItem key={item.id}>
												<SidebarMenuButton
													className="cursor-pointer data-[active=true]:bg-[#dbded3] data-[active=true]:font-medium data-[active=true]:text-[#2d3a1e]"
													size="sm"
													asChild
													onClick={() =>
														navigate({
															to: item.path,
														})
													}
													isActive={active}
												>
													<div>
														<div
															className={
																active
																	? "flex items-center gap-2 text-[#2d3a1e]"
																	: "flex items-center gap-2 text-[#777]"
															}
														>
															<item.icon
																className={
																	active
																		? "h-4 w-4 text-[#4a6030]"
																		: "h-4 w-4 text-[#999]"
																}
															/>
															<span className="text-left text-xs font-bold capitalize">
																{item.label}
															</span>
														</div>
													</div>
												</SidebarMenuButton>
											</SidebarMenuItem>
										)
									})}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					</SidebarContent>
					<SidebarFooter className="p-3">
						<SidebarSeparator />
						<div className="flex items-center gap-2.5 px-1 py-1">
							<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-300">
								<span className="text-[10px] font-bold text-amber-900">
									{HARDCODED_ADMIN.initial}
								</span>
							</div>
							<div className="min-w-0">
								<p className="truncate text-[11px] font-medium">
									{HARDCODED_ADMIN.name}
								</p>
								<p className="truncate text-[10px] text-muted-foreground">
									{HARDCODED_ADMIN.email}
								</p>
							</div>
						</div>
					</SidebarFooter>
				</Sidebar>
				<div className="relative min-h-dvh w-full">
					{isMobile && <SidebarTrigger className="fixed top-4 right-4 z-50" />}
					<Outlet />
				</div>
			</SidebarProvider>
		</div>
	)
}
