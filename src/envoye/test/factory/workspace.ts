import { Factory } from "fishery"
import {
	type Workspace,
	WorkspaceStatus,
} from "@envoye/features/workspace/interface/workspace.interface.ts"
import { mockFakeCode } from "@common/test/helpers/mocks.ts"

export const workspaceFactory = Factory.define<Workspace>(({ sequence }) => ({
	code: mockFakeCode(),
	name: `Workspace ${sequence}`,
	status: WorkspaceStatus.ACTIVE,
}))
