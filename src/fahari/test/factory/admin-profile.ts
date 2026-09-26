import type { AdminProfile } from "@fahari/features/admin/api/current-admin.ts"
import { faker } from "@faker-js/faker"
import { Factory } from "fishery"

export const adminProfileFactory = Factory.define<AdminProfile>(() => {
	const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()

	return {
		firstName,
		lastName,
		email: faker.internet.email({ firstName, lastName }).toLowerCase(),
		permissions: [],
	}
})
