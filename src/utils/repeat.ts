export function repeat(n: number, fn: () => void): void {
	for (let i = 0; i < n; i++) {
		fn()
	}
}
