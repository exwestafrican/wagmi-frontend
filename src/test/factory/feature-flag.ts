import { faker } from "@faker-js/faker"
import { Factory } from "fishery"
import {
	FeatureFlagStatus,
	type FeatureFlag,
} from "@/features/admin/interface/feature-flag.ts"

export const featureFlagFactory = Factory.define<FeatureFlag>(
	({ sequence }) => ({
		key: `ff_${sequence}_${faker.string.alphanumeric(6)}`,
		name: `Feature ${sequence}`,
		description: faker.lorem.sentence(),
		status: FeatureFlagStatus.GLOBAL,
	}),
)
