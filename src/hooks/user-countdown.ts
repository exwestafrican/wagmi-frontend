import { useEffect, useState } from "react"

export function useCountDown(startCount: number) {
	const [count, setCount] = useState(startCount)

	useEffect(() => {
		const interval = setInterval(() => {
			setCount((prev) => {
				if (prev === 0) {
					clearInterval(interval)
					return prev
				}
				return prev - 1
			})
		}, 1000)

		return () => clearInterval(interval)
	}, [])

	return {
		count,
		isFinished: count === 0,
	}
}
