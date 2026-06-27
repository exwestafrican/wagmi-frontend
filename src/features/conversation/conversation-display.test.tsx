import { describe, expect, test, vi } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ApiPaths } from "@/constants.ts"
import { apiClient } from "@/lib/api-client.ts"
import { WorkspaceCode } from "@/test/constants.ts"
import { teammateFactory } from "@/test/factory/teammate.ts"
import {
	navigateToConversationPage,
	navigateToWorkspacePage,
} from "@/test/helpers/workspace.ts"
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
			screen.getByLabelText("conversation-participant-fullname"),
		).toHaveTextContent(fullName(alice))
		expect(screen.getByLabelText("intro-fullname")).toHaveTextContent(
			fullName(alice),
		)

		expect(
			screen.getByPlaceholderText(`Message ${alice.username}`),
		).toBeInTheDocument()
	})

	test("shows intro copy when opening a DM from sidebar and updates when switching teammate", async () => {
		const user = userEvent.setup()
		const you = teammateFactory.build({
			id: 7,
			firstName: "Tochukwu",
			lastName: "Gbubemi",
			username: "odumodublvck",
		})
		const raymond = teammateFactory.build({
			id: 1,
			firstName: "Raymond",
			lastName: "Omo",
			username: "raymond.omo",
		})
		const abbas = teammateFactory.build({
			id: 2,
			firstName: "Abbas",
			username: "abbas",
		})

		await navigateToWorkspacePage(
			envoyeWorkspace,
			you,
			[raymond, abbas],
			[
				{ id: 1, authorId: you.id, participantIds: [raymond.id] },
				{ id: 2, authorId: you.id, participantIds: [abbas.id] },
			],
		)

		await screen.findByText(/direct messages/i)
		await user.click(screen.getByRole("button", { name: fullName(raymond) }))

		expect(
			await screen.findByText(/This conversation is just between/i),
		).toBeInTheDocument()
		expect(screen.getByLabelText("intro-username")).toHaveTextContent(
			`@${raymond.username}`,
		)
		expect(screen.getByText(/and you\./i)).toBeInTheDocument()

		await user.click(screen.getByRole("button", { name: fullName(abbas) }))

		expect(screen.getByLabelText("intro-username")).toHaveTextContent(
			`@${abbas.username}`,
		)
	})

	test("shows intro for new and existing conversations, then hides intro on blank new conversation", async () => {
		const user = userEvent.setup()
		const you = teammateFactory.build({
			id: 7,
			firstName: "Tochukwu",
			lastName: "Gbubemi",
			username: "odumodublvck",
		})
		const oladele = teammateFactory.build({
			id: 3,
			firstName: "Oladele",
			lastName: "Alade",
			username: "oladele.alade",
		})
		const raymond = teammateFactory.build({
			id: 1,
			firstName: "Raymond",
			lastName: "Omon",
			username: "raymond.omon",
		})

		await navigateToWorkspacePage(
			envoyeWorkspace,
			you,
			[oladele, raymond],
			[{ id: 1, authorId: you.id, participantIds: [raymond.id] }],
		)

		await screen.findByText(/direct messages/i)
		await user.click(
			screen.getByRole("button", { name: /new-direct-message/i }),
		)
		await user.click(
			screen.getByRole("button", {
				name: new RegExp(`suggested teammate=${oladele.id}`, "i"),
			}),
		)

		expect(
			await screen.findByText(/This conversation is just between/i),
		).toBeInTheDocument()
		expect(screen.getByLabelText("intro-username")).toHaveTextContent(
			`@${oladele.username}`,
		)
		expect(screen.getByText(/and you\./i)).toBeInTheDocument()

		await user.click(screen.getByRole("button", { name: fullName(raymond) }))

		expect(screen.getByLabelText("intro-username")).toHaveTextContent(
			`@${raymond.username}`,
		)

		await user.click(
			screen.getByRole("button", { name: /new-direct-message/i }),
		)

		expect(
			screen.queryByText(/This conversation is just between/i),
		).not.toBeInTheDocument()
		expect(screen.queryByLabelText("intro-username")).not.toBeInTheDocument()
	})

	test("does not show messages from previous conversation after starting a new one", async () => {
		const user = userEvent.setup()
		const message = "How far, Raymond?"
		const you = teammateFactory.build({
			id: 7,
			firstName: "Tochukwu",
			lastName: "Gbubemi",
			username: "odumodublvck",
		})
		const raymond = teammateFactory.build({
			id: 1,
			firstName: "Raymond",
			lastName: "Omon",
			username: "raymond.omon",
		})
		const oladele = teammateFactory.build({
			id: 3,
			firstName: "Oladele",
			lastName: "Alade",
			username: "oladele.alade",
		})

		await navigateToWorkspacePage(
			envoyeWorkspace,
			you,
			[raymond, oladele],
			[{ id: 1, authorId: you.id, participantIds: [raymond.id] }],
		)

		await screen.findByText(/direct messages/i)
		await user.click(screen.getByRole("button", { name: fullName(raymond) }))

		const composer = screen.getByRole("textbox", { name: /message-composer/i })
		await user.type(composer, message)
		await user.click(screen.getByRole("button", { name: /send-message/i }))
		expect(await screen.findByText(message)).toBeInTheDocument()

		await user.click(
			screen.getByRole("button", { name: /new-direct-message/i }),
		)
		await user.click(
			screen.getByRole("button", {
				name: new RegExp(`suggested teammate=${oladele.id}`, "i"),
			}),
		)

		expect(screen.queryByText(message)).not.toBeInTheDocument()
	})

	test("calls send reply endpoint when user replies in an existing conversation", async () => {
		vi.mocked(apiClient.post).mockResolvedValue({ data: {} })

		const user = userEvent.setup()
		const message = "How far, Raymond?"
		const you = teammateFactory.build({
			id: 7,
			firstName: "Tochukwu",
			lastName: "Gbubemi",
			username: "odumodublvck",
		})
		const raymond = teammateFactory.build({
			id: 1,
			firstName: "Raymond",
			lastName: "Omon",
			username: "raymond.omon",
		})

		await navigateToWorkspacePage(
			envoyeWorkspace,
			you,
			[raymond],
			[{ id: 1, authorId: you.id, participantIds: [raymond.id] }],
		)

		await screen.findByText(/direct messages/i)
		await user.click(screen.getByRole("button", { name: fullName(raymond) }))

		const composer = screen.getByRole("textbox", { name: /message-composer/i })
		await user.type(composer, message)
		await user.click(screen.getByRole("button", { name: /send-message/i }))

		expect(await screen.findByText(message)).toBeInTheDocument()

		await waitFor(() => {
			expect(apiClient.post).toHaveBeenCalledWith(
				ApiPaths.SEND_REPLY,
				expect.objectContaining({
					workspaceCode: envoyeWorkspace.code,
					conversationId: 1,
					message: [message],
					sentAt: expect.any(String),
				}),
			)
		})
	})
})
