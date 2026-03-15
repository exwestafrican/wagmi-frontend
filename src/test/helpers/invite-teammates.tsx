import { type UserEvent } from "@testing-library/user-event"
import { screen } from "@testing-library/react"

export async function enterEmailToInvite(user: UserEvent, email: string) {
	const inviteEmailInput = screen.getByTestId("email-pill-input")
	await user.type(inviteEmailInput, email)
	await user.tab()
}
