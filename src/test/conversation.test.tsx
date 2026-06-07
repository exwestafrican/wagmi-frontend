import { describe, expect, vi, test, beforeEach } from "vitest"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { navigateToWorkspacePage } from "@/test/helpers/workspace.ts"
import { teammateFactory } from "@/test/factory/teammate.ts"
import { workspaceFactory } from "@/test/factory/workspace.ts"

describe("Single Teammate Conversation", () => {
	let user: UserEvent

	beforeEach(async () => {
		user = userEvent.setup()
	})

	test(" when user hits send message appears on screen", async () => {
		const workspace = workspaceFactory.build()
		const teammate = teammateFactory.build()
		const workspaceTeammates = teammateFactory.buildList(4)
		await navigateToWorkspacePage(workspace, teammate, workspaceTeammates)
	})
})
