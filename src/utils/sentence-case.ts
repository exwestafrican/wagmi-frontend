function sentenceCase(str: string) {
	return str.charAt(0).toLocaleUpperCase() + str.slice(1)
}

export default sentenceCase
