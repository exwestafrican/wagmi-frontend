export {}

declare global {
	interface VirtualKeyboard {
		readonly boundingRect?: DOMRectReadOnly
		addEventListener(
			type: "geometrychange",
			listener: (this: VirtualKeyboard, ev: Event) => unknown,
			options?: boolean | AddEventListenerOptions,
		): void
		removeEventListener(
			type: "geometrychange",
			listener: (this: VirtualKeyboard, ev: Event) => unknown,
			options?: boolean | EventListenerOptions,
		): void
	}

	interface Navigator {
		readonly virtualKeyboard: VirtualKeyboard
	}
}
