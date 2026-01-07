import { useEffect, useState, useTransition } from "react"
import { useTranslation } from "react-i18next"

function CountdownUnit({ value, label }: { value: number; label: string }) {
	return (
		<div className="flex-1 flex flex-col">
			<div className="text-4xl tracking-tight">{value}</div>
			<h2 className="text-xs text-foreground/40 tracking-wide archivo-narrow-font">
				{label.toLocaleUpperCase()}
			</h2>
		</div>
	)
}
const MARCH = 2
const LAUNCH_DATE = new Date(2026, MARCH, 14) // Move outside component

export default function CountdownClock() {
	const { t } = useTranslation("waitlist")
	const ONE_SECOND = 1000 // 1,000ms -> 1sec
	const SECONDS_IN_A_DAY = 86400
	const SECONDS_IN_AN_HOUR = 3600
	const SECONDS_IN_A_MINUTE = 60
	const [timeLeft, setTimeLeft] = useState({
		days: 29,
		hours: 23,
		minutes: 57,
		seconds: 23,
	})

	useEffect(() => {
		const calculateTimeLeft = () => {
			const currentLocalDateTime = Date.now()
			const totalSeconds = Math.max(
				0,
				Math.floor((LAUNCH_DATE.getTime() - currentLocalDateTime) / 1000),
			)

			setTimeLeft({
				days: Math.floor(totalSeconds / SECONDS_IN_A_DAY),
				hours: Math.floor(totalSeconds / SECONDS_IN_AN_HOUR) % 24,
				minutes: Math.floor(totalSeconds / SECONDS_IN_A_MINUTE) % 60,
				seconds: totalSeconds % 60,
			})
		}
		calculateTimeLeft()
		const timer = setInterval(calculateTimeLeft, ONE_SECOND) // call this every one second

		return () => clearInterval(timer)
	}, [])

	const getLabelValue = (key: string) => {
		//TODO: Translate the label to the user's language
		switch (key) {
			case "days":
				return t("days")
			case "hours":
				return t("hours")
			case "minutes":
				return t("minutes")
			case "seconds":
				return t("seconds")
			default:
				return ""
		}
	}

	return (
		<div data-testid="countdown-clock" className="flex gap-3 align-start">
			<CountdownUnit value={timeLeft.days} label={getLabelValue("days")} />
			<CountdownUnit value={timeLeft.hours} label={getLabelValue("hours")} />
			<CountdownUnit
				value={timeLeft.minutes}
				label={getLabelValue("minutes")}
			/>
			<CountdownUnit
				value={timeLeft.seconds}
				label={getLabelValue("seconds")}
			/>
		</div>
	)
}
