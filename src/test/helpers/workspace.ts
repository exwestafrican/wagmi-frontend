import type { Workspace } from "@/features/workspace/interface/workspace.interface.ts"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import { teammateFactory } from "@/test/factory/teammate.ts"
import { useAuthStore } from "@/stores/auth.store.ts"
import { navigateToTestPage } from "@/test/helpers/navigate.tsx"
import { vi } from "vitest"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"

export async function navigateToWorkspacePage(
	workspace: Workspace,
	teammate: Teammate = teammateFactory.build(),
	workspaceTeammates: Teammate[] = [],
) {
	useAuthStore.getState().setAuthToken("fake-token")
	mockWorkspaceAndCurrentTeammate(workspace, teammate, workspaceTeammates)
	return await navigateToTestPage({
		to: "/workspace",
		search: { code: workspace.code },
	})
}

export function mockWorkspaceAndCurrentTeammate(
	workspace: Workspace,
	teammate: Teammate = teammateFactory.build(),
    otherTeammates: Teammate[] = [],
) {
	const teammates = [teammate, ...otherTeammates]

	vi.mocked(apiClient.get).mockImplementation((url: string) => {
		if (url === ApiPaths.WORKSPACE) {
			return Promise.resolve({ data: workspace })
		}
		if (url === ApiPaths.CURRENT_TEAMMATE) {
			return Promise.resolve({ data: teammate })
		}
		if (url === ApiPaths.ACTIVE_TEAMMATES) {
			return Promise.resolve({ data: teammates })
		}
		return Promise.reject(new Error(`Unexpected GET ${url}`))
	})
}
