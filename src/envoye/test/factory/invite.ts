import { Factory } from "fishery"
import type { DecodedInvite } from "@envoye/features/workspace/api/verify-invite.ts"
import { faker } from "@faker-js/faker"
import { mockFakeCode } from "@common/test/helpers/mocks.ts"

export const decodedInviteFactory = Factory.define<DecodedInvite>(() => ({
	recipientEmail: faker.internet.email(),
	workspaceCode: mockFakeCode(),
	inviteCode: mockFakeCode(),
}))
