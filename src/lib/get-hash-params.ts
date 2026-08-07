export function getHashParams(
	key: string,
	routerHash?: string,
): string | undefined {
	const params = new URLSearchParams(routerHash)
	return params.get(key) ?? undefined
}
