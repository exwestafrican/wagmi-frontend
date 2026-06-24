import { describe, expect, test } from "vitest"
import { screen } from "@testing-library/react"
import { WorkspaceCode } from "@/test/constants.ts"
import { teammateFactory } from "@/test/factory/teammate.ts"
import { navigateToConversationPage } from "@/test/helpers/workspace.ts"
import { fullName } from "@/features/directory/utils/teammate.ts"
import { WorkspaceStatus } from "@/features/workspace/interface/workspace.interface.ts"

const envoyeWorkspace = {
	code: WorkspaceCode.ENVOYE,
	name: "Envoye",
	status: WorkspaceStatus.ACTIVE,
}

describe("Conversation page display name", () => {
	test("conversation header shows counterparty display name", async () => {
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

		await navigateToConversationPage(
			envoyeWorkspace,
			you,
			[alice],
			[{ id: 1, authorId: you.id, participantIds: [alice.id] }],
			1,
		)

		expect(
			await screen.findByRole("heading", { name: fullName(alice) }),
		).toBeInTheDocument()
		expect(
			screen.getByPlaceholderText(`Message ${alice.username}`),
		).toBeInTheDocument()
	})
})
