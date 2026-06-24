import type { Workspace } from "@/features/workspace/interface/workspace.interface.ts"
import type { Teammate } from "@/features/workspace/interface/teammate.interface.ts"
import type { ConversationApiResponse } from "@/features/conversation/api/list-conversation.ts"
import { teammateFactory } from "@/test/factory/teammate.ts"
import { useAuthStore } from "@/stores/auth.store.ts"
import { navigateToTestPage } from "@/test/helpers/navigate.tsx"
import { vi } from "vitest"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"
import { act } from "@testing-library/react"

export async function navigateToWorkspacePage(
	workspace: Workspace,
	teammate: Teammate = teammateFactory.build(),
	workspaceTeammates: Teammate[] = [],
	conversations: ConversationApiResponse[] = [],
	enabledFeatures: string[] = [],
) {
	return await act(async () => {
		useAuthStore.getState().setAuthToken("fake-token")
		mockWorkspaceAndCurrentTeammate(
			workspace,
			teammate,
			workspaceTeammates,
			conversations,
			enabledFeatures,
		)
		return await navigateToTestPage({
			to: "/workspace",
			search: { code: workspace.code },
		})
	})
}

export async function navigateToConversationPage(
	workspace: Workspace,
	teammate: Teammate,
	workspaceTeammates: Teammate[],
	conversations: ConversationApiResponse[],
	conversationId: number,
) {
	return await act(async () => {
		useAuthStore.getState().setAuthToken("fake-token")
		mockWorkspaceAndCurrentTeammate(
			workspace,
			teammate,
			workspaceTeammates,
			conversations,
		)
		return await navigateToTestPage({
			to: "/workspace/conversation",
			search: { code: workspace.code, conversationId },
		})
	})
}

export function mockWorkspaceAndCurrentTeammate(
	workspace: Workspace,
	teammate: Teammate = teammateFactory.build(),
	otherTeammates: Teammate[] = [],
	conversations: ConversationApiResponse[] = [],
	enabledFeatures: string[] = [],
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
		if (url === ApiPaths.CONVERSATIONS) {
			return Promise.resolve({ data: conversations })
		}
		if (url === ApiPaths.FEATURE_FLAGS_ENABLED) {
			return Promise.resolve({ data: enabledFeatures })
		}
		return Promise.reject(new Error(`Unexpected GET ${url}`))
	})
}
