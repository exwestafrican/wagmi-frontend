import { create } from "zustand"
import { persist } from "zustand/middleware"

export type FahariThemeMode = "light" | "dark"

interface FahariThemeStore {
	mode: FahariThemeMode
	setMode: (mode: FahariThemeMode) => void
	toggleMode: () => void
}

function systemMode(): FahariThemeMode {
	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light"
}

// Starts from the device setting; once the visitor picks a mode it is remembered.
export const useFahariThemeStore = create<FahariThemeStore>()(
	persist(
		(set) => ({
			mode: systemMode(),
			setMode: (mode) => set({ mode }),
			toggleMode: () =>
				set((state) => ({ mode: state.mode === "dark" ? "light" : "dark" })),
		}),
		{
			name: "fahari-theme",
		},
	),
)
