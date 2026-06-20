import type { ReactNode } from "react"

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

function ChatBody({ children }: { children: ReactNode }) {
	return <div className="flex flex-col flex-1 min-h-0">{children}</div>
}

function ChatComposer({ children }: { children: ReactNode }) {
	return <div className="shrink-0 px-4 pt-4 pb-6">{children}</div>
}

export const Chat = Object.assign(ChatRoot, {
	Header: ChatHeader,
	Body: ChatBody,
	Composer: ChatComposer,
})
