import { describe, expect, test } from "vitest"
import { screen } from "@testing-library/react"
import { WorkspaceCode } from "@/test/constants.ts"
import { teammateFactory } from "@/test/factory/teammate.ts"
import { navigateToWorkspacePage } from "@/test/helpers/workspace.ts"
import { WorkspaceStatus } from "@/features/workspace/interface/workspace.interface.ts"

const envoyeWorkspace = {
	code: WorkspaceCode.ENVOYE,
	name: "Envoye",
	status: WorkspaceStatus.ACTIVE,
}

describe("Collaborate sidebar section visibility", () => {
	test("does not display collaborate section when no collaborative conversations exist", async () => {
		const you = teammateFactory.build({
			id: 7,
			firstName: "Tochukwu",
			lastName: "Gbubemi",
			username: "odumodublvck",
		})

		await navigateToWorkspacePage(envoyeWorkspace, you)

		await screen.findByText(/direct messages/i)
		expect(screen.queryByText(/collaborate/i)).not.toBeInTheDocument()
	})

	test("displays collaborate section when collaborative conversations exist", async () => {
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
		const bob = teammateFactory.build({
			id: 6,
			firstName: "Damini",
			lastName: "Ogulu",
			username: "burnaboy",
		})

		await navigateToWorkspacePage(
			envoyeWorkspace,
			you,
			[alice, bob],
			[],
			[{ id: 10, authorId: you.id, participantIds: [alice.id, bob.id] }],
		)

		expect(await screen.findByText(/collaborate/i)).toBeInTheDocument()
	})
})
