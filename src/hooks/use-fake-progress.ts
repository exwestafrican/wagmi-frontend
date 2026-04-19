import { useEffect, useState } from "react"

export function useFakeProgress(isCompleted: boolean, delay: number = 300) {
	const [progress, setProgress] = useState(0)

	useEffect(() => {
		const interval = setInterval(() => {
			setProgress((prev) => {
				if (isCompleted) return 100

				if (prev < 30) return prev + 10
				if (prev < 60) return prev + 5
				if (prev < 80) return prev + 2
				if (prev < 90) return prev + 0.5

				return prev
			})
		}, delay)

		return () => clearInterval(interval)
	}, [isCompleted])

	return progress
}
