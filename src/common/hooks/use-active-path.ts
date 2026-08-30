import { useMatchRoute } from "@tanstack/react-router"

export default function useActivePath(): (currentPath: string) => boolean {
	const matchRoute = useMatchRoute()
	return (currentPath: string) => {
		return Boolean(
			matchRoute({
				to: currentPath,
				fuzzy: true, // child routes still count as “under” this match; tune per docs
			}),
		)
	}
}
