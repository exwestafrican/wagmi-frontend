import { type ForwardedRef, type ReactNode, useCallback } from "react"
import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from "react"

function ChatRoot({ children }: { children: ReactNode }) {
	return (
		<div className="flex flex-col h-dvh min-h-0 overflow-hidden">
			{children}
		</div>
	)
}

function ChatHeader({ children }: { children: ReactNode }) {
	return <div className="shrink-0">{children}</div>
}

export type ChatBodyRef = {
	scrollIntoView: (options?: ScrollIntoViewOptions) => void
}

type ChatBodyProps = {
	children: ReactNode
	scrollKey: number
	sendScrollToken: number
}

const ChatBody = forwardRef<ChatBodyRef, ChatBodyProps>(function ChatBody(
	{ children, scrollKey, sendScrollToken }: ChatBodyProps,
	ref: ForwardedRef<ChatBodyRef>,
) {
	const viewportRef = useRef<HTMLDivElement | null>(null)
	const bottomRef = useRef<HTMLDivElement | null>(null)
	const wasNearBottomRef = useRef(false)

	const isNearBottom = useCallback((clientHeight?: number) => {
		const viewport = viewportRef.current
		if (!viewport) return false
		const height = clientHeight ?? viewport.clientHeight
		const distanceFromBottom =
			viewport.scrollHeight - (viewport.scrollTop + height)
		return distanceFromBottom <= 60
	}, [])

	useImperativeHandle(ref, () => ({
		scrollIntoView(options: ScrollIntoViewOptions = {}) {
			bottomRef.current?.scrollIntoView({
				block: "end",
				behavior: "auto",
				...options,
			})
		},
	}))

	useLayoutEffect(() => {
		if (sendScrollToken === 0) return
		bottomRef.current?.scrollIntoView({ block: "end", behavior: "auto" })
	}, [sendScrollToken])

	useLayoutEffect(() => {
		if (scrollKey === 0) return
		if (!wasNearBottomRef.current) return
		bottomRef.current?.scrollIntoView({ block: "end", behavior: "auto" })
	}, [scrollKey])

	useLayoutEffect(() => {
		wasNearBottomRef.current = isNearBottom()

		function isComposerFocused() {
			const active = document.activeElement
			return (
				active instanceof HTMLElement &&
				active.getAttribute("aria-label") === "message-composer"
			)
		}

		function applyScrollDelta(
			delta: number,
			wasNearBottomBeforeResize: boolean,
		) {
			if (Math.abs(delta) < 10) return
			if (!isComposerFocused()) return
			if (!wasNearBottomBeforeResize) return

			requestAnimationFrame(() => {
				const viewport = viewportRef.current
				if (!viewport) return
				viewport.scrollTop += delta
				wasNearBottomRef.current = isNearBottom()
			})
		}

		const viewport = viewportRef.current
		if (!viewport) return

		let lastViewportHeight = viewport.clientHeight

		const observer = new ResizeObserver(() => {
			const current = viewportRef.current
			if (!current) return

			const previousHeight = lastViewportHeight
			const nextHeight = current.clientHeight
			const delta = previousHeight - nextHeight
			lastViewportHeight = nextHeight

			const wasNearBottomBeforeResize = isNearBottom(previousHeight)
			applyScrollDelta(delta, wasNearBottomBeforeResize)
		})

		observer.observe(viewport)
		return () => {
			observer.disconnect()
		}
	}, [isNearBottom])

	return (
		<div className="flex flex-col flex-1 min-h-0 px-4 pt-4">
			<div
				ref={viewportRef}
				className="flex-1 min-h-0 overflow-y-auto"
				onScroll={() => {
					wasNearBottomRef.current = isNearBottom()
				}}
			>
				<div className="min-h-full flex flex-col justify-end gap-3 pb-3">
					{children}
				</div>
				<div ref={bottomRef} aria-hidden className="h-px shrink-0" />
			</div>
		</div>
	)
})

function ChatComposer({ children }: { children: ReactNode }) {
	return <div className="shrink-0 px-4 pt-4 pb-6">{children}</div>
}

export const Chat = Object.assign(ChatRoot, {
	Header: ChatHeader,
	Body: ChatBody,
	Composer: ChatComposer,
})
