import { useMatches } from "@tanstack/react-router"
import { useEffect } from "react"

export type Product = "envoye" | "fahari"

const branding: Record<Product, { title: string; icon: string }> = {
	envoye: { title: "Envoye", icon: "/favicon.ico" },
	fahari: { title: "Fahari", icon: "/fahari-favicon.svg" },
}

// Both products ship in one build, so the tab title and favicon follow the
// current route: any matched route tagged `staticData.product: "fahari"` switches it.
// A route can refine the title through its `head` (e.g. the booking listing name);
// the deepest match with a title wins.
export default function useProductBranding() {
	const product = useMatches({
		select: (matches): Product =>
			matches.some((match) => match.staticData.product === "fahari")
				? "fahari"
				: "envoye",
	})
	const routeTitle = useMatches({
		select: (matches) =>
			matches
				.flatMap((match) => match.meta ?? [])
				.map((meta) => meta?.title)
				.filter(Boolean)
				.at(-1),
	})

	useEffect(() => {
		document.title = routeTitle ?? branding[product].title
	}, [product, routeTitle])

	useEffect(() => {
		let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
		if (!link) {
			link = document.createElement("link")
			link.rel = "icon"
			document.head.appendChild(link)
		}
		link.href = branding[product].icon
	}, [product])
}
