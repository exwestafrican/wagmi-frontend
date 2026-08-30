import { differenceInCalendarDays, format, isSameYear } from "date-fns"
import type { MessageContent } from "@envoye/features/conversation/interface/text-node.ts"

function toDate(createdAt: number): Date {
	return new Date(createdAt)
}

type DateLabelTier = "today" | "yesterday" | "weekday" | "monthDay" | "fullDate"

function getDateLabelTier(date: Date, now: Date): DateLabelTier {
	const daysAgo = differenceInCalendarDays(now, date)

	if (daysAgo === 0) return "today"
	if (daysAgo === 1) return "yesterday"
	if (daysAgo <= 7) return "weekday"
	if (isSameYear(date, now)) return "monthDay"
	return "fullDate"
}

export function getMessageDayKey(createdAt: number): string {
	return format(toDate(createdAt), "yyyy-MM-dd")
}

export function getMessageDateDividerLabel(
	createdAt: number,
	now = new Date(),
): string {
	const date = toDate(createdAt)
	const tier = getDateLabelTier(date, now)

	switch (tier) {
		case "today":
			return "Today"
		case "yesterday":
			return "Yesterday"
		case "weekday":
			return format(date, "EEEE")
		case "monthDay":
			return format(date, "MMMM d")
		case "fullDate":
			return format(date, "MMMM d, yyyy")
	}
}

export function formatMessageTimestamp(
	createdAt: number,
	now = new Date(),
): string {
	const date = toDate(createdAt)
	const time = format(date, "h:mm a")
	const tier = getDateLabelTier(date, now)

	switch (tier) {
		case "today":
			return `Today at ${time}`
		case "yesterday":
			return `Yesterday at ${time}`
		case "weekday":
			return `${format(date, "EEEE")} at ${time}`
		case "monthDay":
			return `${format(date, "MMMM d")} at ${time}`
		case "fullDate":
			return `${format(date, "MMMM d, yyyy")} at ${time}`
	}
}

export type MessageDayGroup = {
	dayKey: string
	label: string
	messages: MessageContent[]
}

export function groupMessagesByDay(
	messages: MessageContent[],
	now = new Date(),
): MessageDayGroup[] {
	const groups: MessageDayGroup[] = []

	for (const message of messages) {
		const dayKey = getMessageDayKey(message.createdAt)
		const lastGroup = groups.at(-1)

		// for the first time we create a new group. then we start adding to same group
		if (lastGroup?.dayKey === dayKey) {
			lastGroup.messages.push(message)
		} else {
			groups.push({
				dayKey,
				label: getMessageDateDividerLabel(message.createdAt, now),
				messages: [message],
			})
		}
	}

	return groups
}
