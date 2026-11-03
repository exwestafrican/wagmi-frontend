import type { Product } from "@common/hooks/use-product-branding.ts"

// One build serves both products. The hostname picks the route tree:
// envoye.co and envoye.localhost stay Envoye; fahari.io and fahari.localhost
// are Fahari. Plain localhost has no product in the host, so it is Envoye.
export function productFromHost(hostname: string): Product {
	const host = hostname.toLowerCase()
	if (
		host === "fahari.io" ||
		host.endsWith(".fahari.io") ||
		host === "fahari.localhost"
	) {
		return "fahari"
	}
	return "envoye"
}
