import { Button } from "@common/components/ui/button.tsx"
import { Separator } from "@common/components/ui/separator.tsx"
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
} from "@common/components/ui/sheet.tsx"
import { cn } from "@common/lib/utils.ts"
import { FahariAdminPages } from "@fahari/constants.ts"
import { Link } from "@tanstack/react-router"
import { CalendarDays, Menu } from "lucide-react"
import {
	type ReactNode,
	createContext,
	useContext,
	useMemo,
	useState,
} from "react"

const HARDCODED_ADMIN = {
	name: "Admin",
	email: "admin@company.io",
	initial: "A",
} as const

type AdminDashboardNavContextValue = {
	openMobileNav: () => void
}

const AdminDashboardNavContext =
	createContext<AdminDashboardNavContextValue | null>(null)

export function useAdminDashboardNav() {
	const context = useContext(AdminDashboardNavContext)
	if (!context) {
		throw new Error(
			"useAdminDashboardNav must be used within AdminDashboardLayout",
		)
	}
	return context
}

function BookingIcon({ className }: { className?: string }) {
	return <CalendarDays className={cn("size-4", className)} strokeWidth={2} />
}

function NavItem({
	to,
	label,
	active,
	onNavigate,
}: {
	to: string
	label: string
	active: boolean
	onNavigate?: () => void
}) {
	return (
		<Link
			to={to}
			onClick={onNavigate}
			className={cn(
				"flex items-center gap-2.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150",
				active
					? "bg-[#4a6030]/15 text-[#2d3a1e]"
					: "text-[#777] hover:bg-black/5 hover:text-[#444]",
			)}
		>
			<span className={cn("size-4", active ? "text-[#4a6030]" : "text-[#999]")}>
				<BookingIcon />
			</span>
			{label}
		</Link>
	)
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
	return (
		<nav className="flex-1 space-y-0.5 px-3 py-4">
			<p className="mt-1 mb-2 px-2 text-[10px] font-semibold tracking-widest text-[#999] uppercase">
				Management
			</p>
			<NavItem
				to={FahariAdminPages.BOOKINGS}
				label="Bookings"
				active
				onNavigate={onNavigate}
			/>
		</nav>
	)
}

function SidebarFooter() {
	return (
		<div className="px-4 py-4">
			<Separator className="mb-4 bg-[#e4e2dc]" />
			<div className="flex items-center gap-2.5">
				<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-300">
					<span className="text-[10px] font-bold text-amber-900">
						{HARDCODED_ADMIN.initial}
					</span>
				</div>
				<div className="min-w-0">
					<p className="truncate text-[11px] font-medium text-[#444]">
						{HARDCODED_ADMIN.name}
					</p>
					<p className="truncate text-[10px] text-[#888]">
						{HARDCODED_ADMIN.email}
					</p>
				</div>
			</div>
		</div>
	)
}

function SidebarBrand() {
	return (
		<div className="flex items-center justify-center border-b border-[#e4e2dc] px-4 py-2">
			<img
				src="/fahari-wordmark.svg"
				alt="Fahari"
				className="h-6 w-auto select-none"
			/>
		</div>
	)
}

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
	return (
		<aside className="flex h-full w-52 shrink-0 flex-col border-r border-[#e4e2dc] bg-[#f5f4f0]">
			<SidebarBrand />
			<SidebarNav onNavigate={onNavigate} />
			<SidebarFooter />
		</aside>
	)
}

export function AdminDashboardLayout({ children }: { children: ReactNode }) {
	const [mobileOpen, setMobileOpen] = useState(false)
	const navContext = useMemo(
		() => ({
			openMobileNav: () => setMobileOpen(true),
		}),
		[],
	)

	return (
		<AdminDashboardNavContext.Provider value={navContext}>
			<div className="flex h-screen min-h-screen overflow-hidden bg-[#fafaf8] font-sans">
				<div className="hidden h-full md:flex">
					<SidebarInner />
				</div>

				<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
					<SheetContent
						side="left"
						className="w-52 gap-0 border-[#e4e2dc] bg-[#f5f4f0] p-0 sm:max-w-52"
					>
						<SheetTitle className="sr-only">Navigation</SheetTitle>
						<SheetDescription className="sr-only">
							Fahari admin navigation
						</SheetDescription>
						<SidebarInner onNavigate={() => setMobileOpen(false)} />
					</SheetContent>
				</Sheet>

				<div className="flex min-w-0 flex-1 flex-col overflow-hidden">
					{children}
				</div>
			</div>
		</AdminDashboardNavContext.Provider>
	)
}

export function AdminDashboardMenuButton() {
	const { openMobileNav } = useAdminDashboardNav()

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon-sm"
			onClick={openMobileNav}
			className="cursor-pointer text-slate-500 hover:bg-transparent hover:text-slate-800 md:hidden"
			aria-label="Open menu"
		>
			<Menu className="size-5" strokeWidth={2} />
		</Button>
	)
}
