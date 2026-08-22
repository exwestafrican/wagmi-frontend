export function getHashParams(key: string, hash: string): string | undefined {
	// Router locations expose the hash without "#", window.location keeps it.
	const params = new URLSearchParams(hash.replace(/^#/, ""))
	return params.get(key) ?? undefined
}
