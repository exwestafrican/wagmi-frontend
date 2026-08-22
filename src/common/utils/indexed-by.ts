export default function indexBy<T, V>(
	array: T[],
	getKey: (item: T) => V,
): Map<V, T> {
	return new Map(array.map((item) => [getKey(item), item]))
}
