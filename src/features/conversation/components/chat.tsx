import { type ForwardedRef, type ReactNode, useCallback } from "react"
import {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useLayoutEffect,
	useRef,
} from "react"

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
	const wasNearBottomRef = useRef(true)

	const isNearBottom = useCallback(() => {
		const viewport = viewportRef.current
		if (!viewport) return true
		const distanceFromBottom =
			viewport.scrollHeight - (viewport.scrollTop + viewport.clientHeight)
		return distanceFromBottom <= 120
	}, [])

	useImperativeHandle(ref, () => ({
		scrollIntoView(options: ScrollIntoViewOptions) {
			bottomRef.current?.scrollIntoView(options)
		},
	}))

	useLayoutEffect(() => {
		if (scrollKey === 0) return
		// Only auto-scroll when user is already near bottom.
		// Sending a message force-scrolls via the imperative call in onSend.
		// Tumise: if a new message came in, this might trigger <=======
		// if this annoys user, take it out.
		if (!wasNearBottomRef.current) return
		bottomRef.current?.scrollIntoView({ block: "end", behavior: "auto" })
	}, [scrollKey])

	useEffect(() => {
		wasNearBottomRef.current = isNearBottom()

		const vk = navigator.virtualKeyboard
		let lastKeyboardHeight = vk.boundingRect?.height ?? 0

		const onGeometryChange = () => {
			const nextKeyboardHeight = vk.boundingRect?.height ?? 0
			const delta = nextKeyboardHeight - lastKeyboardHeight
			lastKeyboardHeight = nextKeyboardHeight

			// Ignore tiny changes (rounding / jitter).
			if (Math.abs(delta) < 10) return

			const active = document.activeElement
			const isComposerFocused =
				active instanceof HTMLElement &&
				active.getAttribute("aria-label") === "message-composer"

			if (!isComposerFocused) return

			// Keyboard opening increases keyboardHeight (delta > 0).
			// Adjust scrollTop by delta to keep content stable.
			requestAnimationFrame(() => {
				const viewport = viewportRef.current
				if (!viewport) return
				viewport.scrollTop += delta
			})
		}

		vk.addEventListener("geometrychange", onGeometryChange)
		return () => {
			vk.removeEventListener("geometrychange", onGeometryChange)
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
