import { describe, expect, test } from "vitest"
import {
	formatMessageTimestamp,
	getMessageDateDividerLabel,
	getMessageDayKey,
	groupMessagesByDay,
} from "@envoye/features/conversation/utils/message-date.ts"
import { messageContentFactory } from "@envoye/test/factory/message-content.ts"

const now = new Date(2026, 6, 5, 12, 0, 0)

function at(year: number, month: number, day: number, hour = 10): number {
	return new Date(year, month, day, hour, 15, 0).getTime()
}

describe("getMessageDayKey", () => {
	test("returns yyyy-MM-dd for the message's local calendar day", () => {
		expect(getMessageDayKey(at(2026, 6, 5))).toBe("2026-07-05")
	})
})

describe("getMessageDateDividerLabel", () => {
	test("returns Today for messages sent today", () => {
		expect(getMessageDateDividerLabel(at(2026, 6, 5), now)).toBe("Today")
	})

	test("returns Yesterday for messages sent yesterday", () => {
		expect(getMessageDateDividerLabel(at(2026, 6, 4), now)).toBe("Yesterday")
	})

	test("returns weekday name for messages within the last 7 days", () => {
		expect(getMessageDateDividerLabel(at(2026, 6, 2), now)).toBe("Thursday")
	})

	test("returns month and day for same-year messages older than 7 days", () => {
		expect(getMessageDateDividerLabel(at(2026, 5, 20), now)).toBe("June 20")
	})

	test("returns month, day, and year for messages from prior years", () => {
		expect(getMessageDateDividerLabel(at(2025, 5, 29), now)).toBe(
			"June 29, 2025",
		)
	})
})

describe("formatMessageTimestamp", () => {
	test("includes Today prefix for messages sent today", () => {
		expect(formatMessageTimestamp(at(2026, 6, 5, 21), now)).toBe(
			"Today at 9:15 PM",
		)
	})

	test("includes Yesterday prefix for messages sent yesterday", () => {
		expect(formatMessageTimestamp(at(2026, 6, 4), now)).toBe(
			"Yesterday at 10:15 AM",
		)
	})

	test("includes weekday prefix for recent messages", () => {
		expect(formatMessageTimestamp(at(2026, 6, 2), now)).toBe(
			"Thursday at 10:15 AM",
		)
	})

	test("includes month and day for same-year messages older than 7 days", () => {
		expect(formatMessageTimestamp(at(2026, 5, 20), now)).toBe(
			"June 20 at 10:15 AM",
		)
	})

	test("includes full date for messages from prior years", () => {
		expect(formatMessageTimestamp(at(2025, 5, 29), now)).toBe(
			"June 29, 2025 at 10:15 AM",
		)
	})
})

describe("groupMessagesByDay", () => {
	test("groups consecutive messages on the same day together", () => {
		const morningPing = messageContentFactory.build({
			id: 1,
			createdAt: at(2026, 6, 5, 9),
		})
		const afternoonReply = messageContentFactory.build({
			id: 2,
			createdAt: at(2026, 6, 5, 15),
		})
		const yesterdayNote = messageContentFactory.build({
			id: 3,
			createdAt: at(2026, 6, 4),
		})

		const groups = groupMessagesByDay(
			[yesterdayNote, morningPing, afternoonReply],
			now,
		)

		expect(groups).toHaveLength(2)
		expect(groups[0]).toMatchObject({
			dayKey: "2026-07-04",
			label: "Yesterday",
			messages: [yesterdayNote],
		})
		expect(groups[1]).toMatchObject({
			dayKey: "2026-07-05",
			label: "Today",
			messages: [morningPing, afternoonReply],
		})
	})

	test("preserves message order within and across groups", () => {
		const first = messageContentFactory.build({
			id: 1,
			createdAt: at(2026, 6, 3),
		})
		const second = messageContentFactory.build({
			id: 2,
			createdAt: at(2026, 6, 4),
		})
		const third = messageContentFactory.build({
			id: 3,
			createdAt: at(2026, 6, 5),
		})

		const groups = groupMessagesByDay([first, second, third], now)

		expect(
			groups.map((group) => group.messages.map((message) => message.id)),
		).toEqual([[1], [2], [3]])
	})
})
