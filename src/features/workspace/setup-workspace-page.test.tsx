import renderWithQueryClient, {
	createTestQueryClient,
} from "@/common/renderWithQueryClient.tsx"
import SetupWorkspacePage from "@/features/workspace/setup-workspace-page.tsx"
import { vi, it, describe, expect } from "vitest"
import { HttpStatusCode } from "axios"
import { apiClient } from "@/lib/api-client"
import { waitFor, screen } from "@testing-library/react"
import { faker } from "@faker-js/faker"
import { Pages } from "@/utils/pages.ts"
import { mockError } from "@/test/helpers/mocks.ts"

const navigateMock = vi.fn()
const fakeUuid = "5ce2eb96-3d0b-4567-b556-c8797772763c"

vi.mock("@tanstack/react-router", () => ({
	useNavigate: () => navigateMock,
	useParams: () => ({ preVerificationId: fakeUuid }),
}))

describe("SetupWorkspacePage", () => {
	const mockApiClientPost = vi.mocked(apiClient.post)

	async function setupWorkspacePage() {
		const queryClient = createTestQueryClient()
		renderWithQueryClient(<SetupWorkspacePage />, { queryClient })
	}

	function buildWorkspaceDetails() {
		return {
			workspaceId: 6,
			ownedByCompanyId: 1,
			name: "Envoye",
			status: "ACTIVE",
			code: "e8r4z7",
		}
	}

	it("should navigate to workspace page on successful setup", async () => {
		const fakeAccessToken = faker.string.alphanumeric(20)
		window.location.hash = `access_token=${fakeAccessToken}`
		mockApiClientPost.mockResolvedValue({ data: buildWorkspaceDetails() })

		await setupWorkspacePage()

		await waitFor(() => {
			expect(navigateMock).toHaveBeenCalledWith({
				to: Pages.WORKSPACE,
				search: { code: "e8r4z7" },
			})
		})
	})

	it("should render error page on setup error", async () => {
		const fakeAccessToken = faker.string.alphanumeric(20)
		window.location.hash = `access_token=${fakeAccessToken}`
		mockApiClientPost.mockRejectedValueOnce(
			mockError(HttpStatusCode.BadRequest),
		)

		await setupWorkspacePage()

		await waitFor(() => {
			expect(
				screen.getByText(
					/something unexpected happened please contact support/i,
				),
			).toBeInTheDocument()
		})
	})

	it("should render error page when no access token is provided", async () => {
		await setupWorkspacePage()
		await waitFor(() => {
			expect(
				screen.getByText(
					/something unexpected happened please contact support/i,
				),
			).toBeInTheDocument()
		})
	})
})
