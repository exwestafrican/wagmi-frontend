import { faker } from "@faker-js/faker"
import { Factory } from "fishery"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"

export const teammateFactory = Factory.define<Teammate>(() => ({
	id: faker.string.uuid(),
	email: faker.internet.email(),
	firstName: faker.person.firstName(),
    username: faker.internet.username(),
	lastName: faker.person.lastName(),
}))
