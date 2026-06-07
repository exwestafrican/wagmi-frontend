import { describe, expect, it, beforeEach } from "vitest"
import { screen } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { workspaceFactory } from "@/test/factory/workspace.ts"
import { teammateFactory } from "@/test/factory/teammate.ts"
import { navigateToWorkspacePage } from "@/test/helpers/workspace.ts"
import type { Workspace } from "@/features/workspace/interface/workspace.interface.ts"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import { fullName } from "@/features/directory/utils/teammate.ts"
import { TEST_DESKTOP_KEYS } from "@/constants.ts"

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

	it("focus on input and popover displays suggested teammates", async () => {
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
			teammateFactory.build({
				firstName: "Ayodeji",
				lastName: "Balogun",
				username: "wizkid",
			}),
			teammateFactory.build({
				firstName: "David",
				lastName: "Adeleke",
				username: "davido",
			}),
			...teammateFactory.buildList(20),
		]

		await openNewDmPage(workspace, admin, otherTeammates)

		await screen.findByText(/direct messages/i)
		expect(await screen.findByText(/new conversation/i)).toBeInTheDocument()

		const input = screen.getByRole("textbox")
		expect(input).toHaveFocus()

		// teammate suggestions is displayed
		expect(await screen.findByText("Oluwatosin Oluwole")).toBeInTheDocument()
		expect(screen.getByText("mr.eazi")).toBeInTheDocument()

		// only first 5 teammates are visible
		const visibleTeammates = [admin, ...otherTeammates].slice(0, 10)
		for (const teammate of visibleTeammates) {
			expect(await screen.findByText(fullName(teammate))).toBeInTheDocument()
		}
		expect(
			screen.queryByText(fullName(otherTeammates[11])),
		).not.toBeInTheDocument()

		expect(screen.queryAllByTestId("teammate-suggestions")).length(10)
	})

	it("does not render suggestion box when no teammates found", async () => {
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
		]

		await openNewDmPage(workspace, admin, otherTeammates)
		const input = screen.getByRole("textbox")
		await user.type(input, "zzzzzz")

		expect(screen.queryByTestId("teammate-suggestions")).not.toBeInTheDocument()
	})

	it("closes suggestion box when user clicks escape", async () => {
		const workspace = workspaceFactory.build({ name: "Antiworld" })
		const admin = teammateFactory.build()
		const otherTeammates = teammateFactory.buildList(20)
		await openNewDmPage(workspace, admin, otherTeammates)

		expect(screen.queryAllByTestId("teammate-suggestions")).length(10)
		await user.keyboard(TEST_DESKTOP_KEYS.ESCAPE)
		expect(screen.queryByTestId("teammate-suggestions")).not.toBeInTheDocument()
	})

	it("After escaping user typing should pop up suggestion box", async () => {
		const workspace = workspaceFactory.build({ name: "Antiworld" })
		const admin = teammateFactory.build({
			firstName: "Tochukwu",
			username: "odumodublvck",
		})
		// const otherTeammates = teammateFactory.buildList(20)
		await openNewDmPage(workspace, admin, [])

		expect(screen.queryAllByTestId("teammate-suggestions")).toHaveLength(1)
		await user.keyboard(TEST_DESKTOP_KEYS.ESCAPE)
		expect(screen.queryByTestId("teammate-suggestions")).not.toBeInTheDocument()

		const input = screen.getByRole("textbox")
		await user.type(input, "t")
		expect(screen.getByTestId("teammate-suggestions")).toBeInTheDocument()
	})

	it("closes suggestion box and picks user on click enter", async () => {
		const workspace = workspaceFactory.build({ name: "Antiworld" })
		const admin = teammateFactory.build({ firstName: "Tochukwu" })
		const mavo = teammateFactory.build({
			firstName: "Marvin",
			lastName: "Ukanigbe",
			username: "mavo",
		})
		const otherTeammates = teammateFactory.buildList(20)
		await openNewDmPage(workspace, admin, [mavo, ...otherTeammates])

		const input = screen.getByRole("textbox")
		await user.type(input, "marvin")
		await user.keyboard(TEST_DESKTOP_KEYS.ENTER)
		expect(screen.queryByTestId("teammate-suggestions")).not.toBeInTheDocument()
		expect(screen.getByText(fullName(mavo))).toBeInTheDocument()
		expect(screen.queryByRole("textbox")).not.toBeInTheDocument()
	})

	it("removes selected teammate when user clicks out", async () => {
		const workspace = workspaceFactory.build({ name: "Antiworld" })
		const admin = teammateFactory.build({ firstName: "Tochukwu" })
		const mavo = teammateFactory.build({
			firstName: "Marvin",
			lastName: "Ukanigbe",
			username: "mavo",
		})
		const otherTeammates = teammateFactory.buildList(20)
		await openNewDmPage(workspace, admin, [mavo, ...otherTeammates])

		const input = screen.getByRole("textbox")
		await user.type(input, mavo.firstName)
		await user.keyboard(TEST_DESKTOP_KEYS.ENTER)

		expect(screen.queryByTestId("teammate-suggestions")).not.toBeInTheDocument()
		expect(screen.getByText(fullName(mavo))).toBeInTheDocument()

		await user.click(
			screen.getByRole("button", {
				name: new RegExp(`remove ${mavo.id}`, "i"),
			}),
		)

		expect(
			screen.queryByRole("button", {
				name: new RegExp(`remove ${mavo.id}`, "i"),
			}),
		).not.toBeInTheDocument()
	})
})
