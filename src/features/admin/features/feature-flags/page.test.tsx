import renderWithQueryClient from "@/common/renderWithQueryClient.tsx"
import { AdminApiPaths } from "@/constants.ts"
import AdminFeatureFlagPage from "@/features/admin/features/feature-flags/page.tsx"
import { FeatureFlagStatus } from "@/features/admin/interface/feature-flag.ts"
import { adminApiClient } from "@/lib/admin-api-client.ts"
import { featureFlagFactory } from "@/test/factory/feature-flag.ts"
import { mockAuthedUser } from "@/test/helpers/mocks.ts"
import { screen, waitFor, within } from "@testing-library/react"
import userEvent, { type UserEvent } from "@testing-library/user-event"
import { beforeEach, describe, expect, it, vi } from "vitest"

describe("AdminFeatureFlagPage", () => {
	let user: UserEvent
	const mockApiClientGet = vi.mocked(adminApiClient.get)
	const mockApiClientPost = vi.mocked(adminApiClient.post)
	const mockApiClientPatch = vi.mocked(adminApiClient.patch)

	beforeEach(() => {
		user = userEvent.setup()
	})

	async function setupFeatureFlagPage() {
		mockAuthedUser()
		mockApiClientPost.mockResolvedValue({ data: {} })
		mockApiClientPatch.mockResolvedValue({ data: {} })
		renderWithQueryClient(<AdminFeatureFlagPage />)
	}

	it("removes feature flag from screen and calls delete endpoint", async () => {
		const whatsAppIntegration = featureFlagFactory.build({
			key: "can_integrate_whatsapp",
			name: "WhatsApp Integration",
		})
		const gmailIntegration = featureFlagFactory.build({
			key: "can_integrate_gmail",
			name: "Gmail Integration",
		})

		mockApiClientGet
			.mockResolvedValueOnce({ data: [whatsAppIntegration, gmailIntegration] })
			.mockResolvedValueOnce({ data: [gmailIntegration] })

		await setupFeatureFlagPage()
		await screen.findByText(whatsAppIntegration.name)

		await user.click(
			screen.getByRole("button", {
				name: `Delete ${whatsAppIntegration.key}`,
			}),
		)

		await waitFor(() => {
			expect(
				screen.queryByText(whatsAppIntegration.name),
			).not.toBeInTheDocument()
			expect(screen.getByText(gmailIntegration.name)).toBeInTheDocument()
		})

		expect(mockApiClientPost).toHaveBeenCalledWith(
			AdminApiPaths.DELETE_FEATURE_FLAG,
			{ key: whatsAppIntegration.key },
		)
	})

	it("updates feature flag status when Save is clicked after a change", async () => {
		const whatsAppIntegration = featureFlagFactory.build({
			key: "can_integrate_whatsapp",
			name: "WhatsApp Integration",
			status: FeatureFlagStatus.PARTIAL,
		})
		const updatedWhatsAppIntegration = {
			...whatsAppIntegration,
			status: FeatureFlagStatus.GLOBAL,
		}

		mockApiClientGet
			.mockResolvedValueOnce({ data: [whatsAppIntegration] })
			.mockResolvedValueOnce({ data: [updatedWhatsAppIntegration] })

		await setupFeatureFlagPage()
		await screen.findByText(whatsAppIntegration.name)

		const detailsPanel = screen.getByRole("tabpanel")
		const saveButton = within(detailsPanel).getByRole("button", {
			name: "Save",
		})
		expect(saveButton).toBeDisabled()

		await user.click(
			within(detailsPanel).getByRole("button", { name: /partial/i }),
		)
		await user.click(screen.getByRole("menuitemradio", { name: /global/i }))

		expect(saveButton).toBeEnabled()

		await user.click(saveButton)

		await waitFor(() => {
			expect(mockApiClientPatch).toHaveBeenCalledWith(
				`${AdminApiPaths.FEATURE_FLAGS}/${whatsAppIntegration.key}/status`,
				{ status: FeatureFlagStatus.GLOBAL },
			)
		})

		await waitFor(() => {
			expect(saveButton).toBeDisabled()
		})
	})
})
