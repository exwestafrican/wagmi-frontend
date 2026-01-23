import type { ReactElement } from "react"

export default function WithErrorHandling({
	children,
	hasError,
}: { children: ReactElement; hasError: () => boolean }) {
	if (hasError()) {
		return <div> Something unexpected happened please contact support!</div>
	}

	return children
}
