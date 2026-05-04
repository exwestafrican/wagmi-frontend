import { describe, expect, test, beforeEach } from "vitest"
import { navigateToTestPage } from "@/test/helpers/navigate"

import { screen } from "@testing-library/react"

import userEvent from "@testing-library/user-event"
import type { UserEvent } from "@testing-library/user-event"
import { mockGetUrls } from "@/test/helpers/mocks.ts"
import { type Workspace } from "@/features/workspace/interface/workspace.interface.ts"
import type { FeatureFlag } from "@/features/admin/interface/feature-flag.ts"
import { ApiPaths, AdminApiPaths } from "@/constants.ts"
import { teammateFactory } from "@/test/factory/teammate.ts"
import { featureFlagFactory } from "@/test/factory/feature-flag.ts"
import { FEATURE } from "@/features/feature-flag/const.ts"
import { workspaceFactory } from "@/test/factory/workspace.ts"

describe("Admin / Control Panel", () => {
	let user: UserEvent
	let baseSetup: ReturnType<typeof mockGetUrls>
	let workspace: Workspace

	beforeEach(() => {
		user = userEvent.setup()
		workspace = workspaceFactory.build()

		const teammate = teammateFactory.build()
		const workspaceTeammates = [teammateFactory.build()]
		const m = mockGetUrls({ isAuthenticated: true })
		baseSetup = m
			.url(ApiPaths.WORKSPACE)
			.respond(workspace)
			.url(ApiPaths.CURRENT_TEAMMATE)
			.respond(teammate)
			.url(ApiPaths.ACTIVE_TEAMMATES)
			.respond(workspaceTeammates)
	})

	describe("Control Panel visibility", () => {
		test("hidden when feature_administrative_workspace flag is OFF", async () => {
			baseSetup.url(ApiPaths.FEATURE_FLAGS_ENABLED).respond([]).apply()
			await navigateToTestPage({
				to: "/workspace",
				search: { code: workspace.code },
			})
			expect(screen.queryByText(/control panel/i)).not.toBeInTheDocument()
		})

		test("visible when feature_administrative_workspace flag is ON", async () => {
			baseSetup
				.url(ApiPaths.FEATURE_FLAGS_ENABLED)
				.respond([FEATURE.ADMINISTRATIVE_WORKSPACE])
				.apply()
			await navigateToTestPage({
				to: "/workspace",
				search: { code: workspace.code },
			})
			expect(await screen.findByText(/control panel/i)).toBeInTheDocument()
			expect(screen.getByText(/feature flag/i)).toBeInTheDocument()
		})
	})

	describe("Feature Flag page", () => {
		let flags: FeatureFlag[]

		beforeEach(() => {
			flags = featureFlagFactory.buildList(3)
		})

		test("selects first feature by default and shows it in details", async () => {
			baseSetup
				.url(ApiPaths.FEATURE_FLAGS_ENABLED)
				.respond([FEATURE.ADMINISTRATIVE_WORKSPACE])
				.url(AdminApiPaths.FEATURE_FLAGS)
				.respond(flags)
				.apply()
			await navigateToTestPage({
				to: "/workspace/admin/feature-flag",
				search: { code: workspace.code },
			})
			expect(await screen.findByDisplayValue(flags[0].name)).toBeInTheDocument()
		})

		test("clicking a feature row displays it on the details page", async () => {
			baseSetup
				.url(ApiPaths.FEATURE_FLAGS_ENABLED)
				.respond([FEATURE.ADMINISTRATIVE_WORKSPACE])
				.url(AdminApiPaths.FEATURE_FLAGS)
				.respond(flags)
				.apply()
			await navigateToTestPage({
				to: "/workspace/admin/feature-flag",
				search: { code: workspace.code },
			})
			await user.click(await screen.findByText(flags[2].name))
			expect(await screen.findByDisplayValue(flags[2].name)).toBeInTheDocument()
		})
	})
})
