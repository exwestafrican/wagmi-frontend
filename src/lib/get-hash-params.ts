export function getHashParams(key: string): string | undefined {
	const hash = window.location.hash.substring(1)
	const params = new URLSearchParams(hash)
	return params.get(key) ?? undefined
}
