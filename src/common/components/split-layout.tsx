import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type SplitLayoutProps = {
	children: ReactNode
	className?: string
}

export function SplitLayout({ children, className }: SplitLayoutProps) {
	return (
		<div
			className={cn(
				"flex min-h-screen bg-neutral-200/80 justify-center md:px-12 md:py-12",
				className,
			)}
		>
			<div className="flex w-full flex-col overflow-hidden bg-white shadow-sm md:flex-row md:min-h-full md:rounded-2xl">
				<div className="relative min-h-52 shrink-0 sm:min-h-56 md:min-h-0 md:w-3/5">
					<img
						src="/meditation.svg"
						alt=""
						className="absolute inset-0 size-full object-cover"
					/>
					<div
						className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10"
						aria-hidden
					/>
					<div className="absolute inset-x-0 bottom-0 p-6 md:p-10 text-white">
						<p className="text-2xl font-semibold tracking-tight md:text-3xl">
							Envoye
						</p>
						<p className="mt-2 max-w-sm text-sm leading-relaxed text-white/90">
							Comfortable workflows and a clear path from idea to delivery with
							Envoye.
						</p>
					</div>
				</div>
				{children}
			</div>
		</div>
	)
}
