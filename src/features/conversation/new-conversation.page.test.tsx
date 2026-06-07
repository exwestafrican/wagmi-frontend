import { describe, expect, it, beforeEach } from "vitest"
import { screen } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { workspaceFactory } from "@/test/factory/workspace.ts"
import { teammateFactory } from "@/test/factory/teammate.ts"
import { navigateToWorkspacePage } from "@/test/helpers/workspace.ts"
import type { Workspace } from "@/features/workspace/interface/workspace.interface.ts"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"

describe("Create A new Direct Message", () => {
	let user: UserEvent

	beforeEach(async () => {
		user = userEvent.setup()
	})

	async function openNewDmPage(
		workspace: Workspace,
		admin: Teammate,
		otherTeammates: Teammate[],
	) {
		await navigateToWorkspacePage(workspace, admin, otherTeammates)

		const createDmButton = screen.getByRole("button", {
			name: /new-direct-message/i,
		})
		await user.click(createDmButton)
	}

	it("closes popover when no matches exist", async () => {
		const workspace = workspaceFactory.build({ name: "Antiworld" })
		const admin = teammateFactory.build({
			firstName: "Tochukwu",
			lastName: "Gbubemi",
			username: "odumodublvck",
		})
		const otherTeammates = [
			teammateFactory.build({
				firstName: "Oluwatosin",
				lastName: "Oluwole",
				username: "mr.eazi",
			}),
			teammateFactory.build({
				firstName: "Olamide",
				lastName: "Adedeji",
				username: "badoo",
			}),
			teammateFactory.build({
				firstName: "Marvin",
				lastName: "Ukanigbe",
				username: "mavo",
			}),
		]

		await openNewDmPage(workspace, admin, otherTeammates)

		expect(await screen.findByText(admin.username)).toBeInTheDocument()
		await screen.findByText(/direct messages/i)
		expect(await screen.findByText(/new conversation/i)).toBeInTheDocument()

		//pop over is open
	})
})
