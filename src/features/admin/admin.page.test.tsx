import { describe, expect, test, beforeEach } from "vitest"
import { navigateToTestPage } from "@/test/helpers/navigate"

import {  screen, waitFor, within } from "@testing-library/react"
import { apiClient } from "@/lib/api-client.ts"
import { vi } from "vitest"

import userEvent from "@testing-library/user-event"
import type { UserEvent } from "@testing-library/user-event"
import { mockGetUrls } from "@/test/helpers/mocks.ts"
import type { Workspace } from "@/features/workspace/interface/workspace.interface.ts"
import type { FeatureFlag } from "@/features/admin/interface/feature-flag.ts"
import { ApiPaths, AdminApiPaths } from "@/constants.ts"
import { teammateFactory } from "@/test/factory/teammate.ts"
import { featureFlagFactory } from "@/test/factory/feature-flag.ts"
import { FEATURE } from "@/features/feature-flag/const.ts"
import { workspaceFactory } from "@/test/factory/workspace.ts"
import { repeat } from "@/utils/repeat.ts"

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
			await screen.findByText(/directory/i)
			await waitFor(() => {
				expect(screen.queryByText(/control panel/i)).not.toBeInTheDocument()
			})
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

		describe("Create feature flag modal", () => {
			beforeEach(() => {
				vi.mocked(apiClient.post).mockResolvedValue({ data: {} })
				baseSetup
					.url(ApiPaths.FEATURE_FLAGS_ENABLED)
					.respond([FEATURE.ADMINISTRATIVE_WORKSPACE])
					.url(AdminApiPaths.FEATURE_FLAGS)
					.respond(flags)
					.apply()
			})

			test("opens create modal when Plus is clicked", async () => {
				await navigateToTestPage({
					to: "/workspace/admin/feature-flag",
					search: { code: workspace.code },
				})
				await screen.findByDisplayValue(flags[0].name)
				await user.click(screen.getByTestId("create-feature-flag-button"))
				expect(
					await screen.findByTestId("create-feature-flag-modal"),
				).toBeInTheDocument()
			})

			test("submits create feature flag with POST body", async () => {
				await navigateToTestPage({
					to: "/workspace/admin/feature-flag",
					search: { code: workspace.code },
				})
				await screen.findByDisplayValue(flags[0].name)
				await user.click(screen.getByTestId("create-feature-flag-button"))
				const modal = await screen.findByTestId("create-feature-flag-modal")
				await user.type(within(modal).getByLabelText(/^name$/i), "New Flag")
				await user.type(within(modal).getByLabelText(/^key$/i), "new_flag")
				await user.type(
					within(modal).getByLabelText(/^description$/i),
					"A short description.",
				)
				await user.click(
					within(modal).getByRole("button", { name: /^create$/i }),
				)
				await waitFor(() => {
					expect(vi.mocked(apiClient.post)).toHaveBeenCalledWith(
						AdminApiPaths.FEATURE_FLAGS,
						{
							name: "New Flag",
							key: "new_flag",
							description: "A short description.",
						},
					)
				})
			})

			test("rejects description longer than 200 words", async () => {
				await navigateToTestPage({
					to: "/workspace/admin/feature-flag",
					search: { code: workspace.code },
				})
				await screen.findByDisplayValue(flags[0].name)
				await user.click(screen.getByTestId("create-feature-flag-button"))
				const modal = await screen.findByTestId("create-feature-flag-modal")
				await user.type(
					within(modal).getByLabelText(/^name$/i),
					"New Navigation Ui",
				)
				await user.type(
					within(modal).getByLabelText(/^key$/i),
					"new_navigation_ui",
				)
				repeat(201, async () => {
					await user.type(within(modal).getByLabelText(/^description$/i), "I")
				})
				await waitFor(() => {
					expect(
						within(modal).getByRole("button", { name: /^create$/i }),
					).toBeDisabled()
				})
			})
		})
	})
})
