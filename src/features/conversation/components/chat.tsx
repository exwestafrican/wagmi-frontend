import { type ReactNode, useLayoutEffect, useRef } from "react"

function ChatRoot({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col h-svh min-h-0 overflow-hidden">
			{children}
		</div>
	)
}

function ChatHeader({ children }: { children: ReactNode }) {
	return <div className="shrink-0">{children}</div>
}

function ChatBody({
	children,
	scrollKey,
}: { children: ReactNode; scrollKey: number }) {
	const bottomRef = useRef<HTMLDivElement>(null)

	useLayoutEffect(() => {
		if (scrollKey === 0) return // doing this to satisfy lint dependency.
		bottomRef.current?.scrollIntoView({ block: "end" })
	}, [scrollKey])

	return (
		<div className="flex flex-col flex-1 min-h-0 px-4 pt-4">
			<div className="flex-1 min-h-0 overflow-y-auto">
				<div className="min-h-full flex flex-col justify-end gap-3 pb-3">
					{children}
					<div ref={bottomRef} aria-hidden className="h-px shrink-0" />
				</div>
			</div>
		</div>
	)
}

function ChatComposer({ children }: { children: ReactNode }) {
	return <div className="shrink-0 px-4 pt-4 pb-6">{children}</div>
}

export const Chat = Object.assign(ChatRoot, {
	Header: ChatHeader,
	Body: ChatBody,
	Composer: ChatComposer,
})
