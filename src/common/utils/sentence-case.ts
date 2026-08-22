function sentenceCase(str: string) {
	return str.charAt(0).toLocaleUpperCase() + str.slice(1).toLowerCase()
}

export default sentenceCase

export function modifyCasing(value: string, casing: string) {
	switch (casing) {
		case "sentence-case":
			return sentenceCase(value)
		case "upper-case":
			return value.toUpperCase()
		default:
			return value
	}
}
