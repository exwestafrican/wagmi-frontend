import { faker } from "@faker-js/faker"
import { Factory } from "fishery"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"

export const teammateFactory = Factory.define<Teammate>(() => {
	const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()

	return {
		id: faker.number.int(),
		email: faker.internet.email(),
		firstName: firstName,
		role: "WorkspaceAdmin",
		username: `${firstName.toLowerCase()}.${lastName.toLowerCase()}`,
		lastName: lastName,
	}
})
