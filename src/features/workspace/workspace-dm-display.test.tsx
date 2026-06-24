import { describe, expect, test } from "vitest"
import { screen } from "@testing-library/react"
import { WorkspaceCode } from "@/test/constants.ts"
import { teammateFactory } from "@/test/factory/teammate.ts"
import { navigateToWorkspacePage } from "@/test/helpers/workspace.ts"
import { fullName } from "@/features/directory/utils/teammate.ts"
import { WorkspaceStatus } from "@/features/workspace/interface/workspace.interface.ts"

const envoyeWorkspace = {
	code: WorkspaceCode.ENVOYE,
	name: "Envoye",
	status: WorkspaceStatus.ACTIVE,
}

async function expectDisplayNameInDirectMessages(name: string) {
	await screen.findByText(/direct messages/i)
	expect(await screen.findByText(name)).toBeInTheDocument()
}

describe("Direct messages sidebar display name", () => {
	test("shows counterparty display name when you authored the conversation", async () => {
		const you = teammateFactory.build({
			id: 7,
			firstName: "Tochukwu",
			lastName: "Gbubemi",
			username: "odumodublvck",
		})
		const alice = teammateFactory.build({
			id: 5,
			firstName: "Ayodeji",
			lastName: "Balogun",
			username: "wizkid",
		})

		await navigateToWorkspacePage(
			envoyeWorkspace,
			you,
			[alice],
			[{ id: 1, authorId: you.id, participantIds: [alice.id] }],
		)

		await expectDisplayNameInDirectMessages(fullName(alice))
	})

	test("shows counterparty display name when they authored the conversation", async () => {
		const you = teammateFactory.build({
			id: 7,
			firstName: "Tochukwu",
			lastName: "Gbubemi",
			username: "odumodublvck",
		})
		const alice = teammateFactory.build({
			id: 5,
			firstName: "Ayodeji",
			lastName: "Balogun",
			username: "wizkid",
		})

		await navigateToWorkspacePage(
			envoyeWorkspace,
			you,
			[alice],
			[{ id: 1, authorId: alice.id, participantIds: [you.id] }],
		)

		await expectDisplayNameInDirectMessages(fullName(alice))
	})

	test("shows your display name for a self-DM", async () => {
		const you = teammateFactory.build({
			id: 7,
			firstName: "Tochukwu",
			lastName: "Gbubemi",
			username: "odumodublvck",
		})

		await navigateToWorkspacePage(
			envoyeWorkspace,
			you,
			[],
			[{ id: 1, authorId: 7, participantIds: [7] }],
		)

		await expectDisplayNameInDirectMessages(fullName(you))
	})
})
