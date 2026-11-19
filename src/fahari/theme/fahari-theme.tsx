import { useFahariThemeStore } from "@fahari/theme/theme.store.ts"
import { type ReactNode, useLayoutEffect } from "react"

// Turns the Fahari design system on for as long as it is mounted. The classes go
// on <html> rather than a wrapper so dialogs, sheets and popovers, which render
// outside the page tree, are themed too.
export function FahariTheme({ children }: { children: ReactNode }) {
	const mode = useFahariThemeStore((state) => state.mode)

	useLayoutEffect(() => {
		const root = document.documentElement
		root.classList.add("fahari")
		return () => root.classList.remove("fahari")
	}, [])

	useLayoutEffect(() => {
		const root = document.documentElement
		root.classList.toggle("dark", mode === "dark")
		return () => root.classList.remove("dark")
	}, [mode])

	return <>{children}</>
}
