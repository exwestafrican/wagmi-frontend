import { describe, expect, test } from "vitest"
import {
	ENABLED_FEATURES,
	featureFlagsQueryOptions,
} from "@/features/feature-flag/api/feature-flags"

describe("featureFlagsQueryOptions", () => {
	test("returns the correct query key", () => {
		const options = featureFlagsQueryOptions("workspace-123")
		expect(options.queryKey).toEqual([ENABLED_FEATURES, "workspace-123"])
	})

	test("never becomes stale", () => {
		const options = featureFlagsQueryOptions("workspace-123")
		expect(options.staleTime).toBe(Number.POSITIVE_INFINITY)
	})

	test("does not refetch on window focus", () => {
		const options = featureFlagsQueryOptions("workspace-123")
		expect(options.refetchOnWindowFocus).toBe(false)
	})
})
