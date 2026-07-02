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
	scrollIntoView: (options: ScrollIntoViewOptions) => void
}

type ChatBodyProps = {
	children: ReactNode
	scrollKey: number
}

const ChatBody = forwardRef<ChatBodyRef, ChatBodyProps>(function ChatBody(
	{ children, scrollKey }: ChatBodyProps,
	ref: ForwardedRef<ChatBodyRef>,
) {
	const viewportRef = useRef<HTMLDivElement | null>(null)
	const bottomRef = useRef<HTMLDivElement | null>(null)
	const wasNearBottomRef = useRef(false)
	const contentRef = useRef<HTMLDivElement | null>(null) // this checks if the content size has changed and scrolls to bottom useful for when state changes and ui reflect e.g message failed.

	const isNearBottom = useCallback((clientHeight?: number) => {
		const viewport = viewportRef.current
		if (!viewport) return false
		const height = clientHeight ?? viewport.clientHeight
		const distanceFromBottom =
			viewport.scrollHeight - (viewport.scrollTop + height)
		return distanceFromBottom <= 120
	}, [])

	useImperativeHandle(ref, () => ({
		scrollIntoView(options: ScrollIntoViewOptions) {
			bottomRef.current?.scrollIntoView(options)
		},
	}))

	// NEW: pin to bottom when content grows (failed UI, retry state, etc.)
	useLayoutEffect(() => {
		// This is AI generated code. But we need it because when message fails to send
		// we display a Failed to send message state. Without this, we don't scroll to the very buttom
		// so user won't see the failed message.
		const content = contentRef.current
		if (!content) return
		let lastHeight = content.offsetHeight
		const observer = new ResizeObserver(() => {
			const el = contentRef.current
			if (!el) return
			const nextHeight = el.offsetHeight
			const delta = nextHeight - lastHeight
			lastHeight = nextHeight
			if (delta < 10) return // ignore tiny layout jitter
			if (!wasNearBottomRef.current) return // don't yank user who scrolled up
			requestAnimationFrame(() => {
				bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" })
				wasNearBottomRef.current = isNearBottom()
			})
		})
		observer.observe(content)
		return () => observer.disconnect()
	}, [isNearBottom])

	useLayoutEffect(() => {
		if (scrollKey === 0) return
		// Only auto-scroll when user is already near bottom.
		// Sending a message force-scrolls via the imperative call in onSend.
		// Tumise: if a new message came in, this might trigger <=======
		// if this annoys user, take it out.
		bottomRef.current?.scrollIntoView({ block: "end", behavior: "smooth" })
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
				<div
					ref={contentRef}
					className="min-h-full flex flex-col justify-end gap-3 pb-3"
				>
					{children}
					<div ref={bottomRef} aria-hidden className="h-px shrink-0" />
				</div>
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
