import type { DriverAccount } from "@fahari/features/admin/accounts/api/list-accounts.ts"
import { faker } from "@faker-js/faker"
import { Factory } from "fishery"

export const driverAccountFactory = Factory.define<DriverAccount>(() => {
	const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()

	return {
		userId: faker.number.int({ min: 1, max: 10_000 }),
		firstName,
		lastName,
		email: faker.internet.email({ firstName, lastName }).toLowerCase(),
		reservedAccountId: faker.number.int({ min: 1, max: 10_000 }),
		accountNumber: `FAH${faker.string.numeric(7)}`,
	}
})
