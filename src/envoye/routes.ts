import {
	acceptInviteRoute,
	checkEmailRoute,
	existingWorkspaceSetupRoute,
	indexRoute,
	loginRoute,
	signupRoute,
	workspaceSetupRoute,
} from "@envoye/routing/root.ts"
import { workspaceRouteTree } from "@envoye/routing/workspace.ts"
import { adminRouteTree } from "@envoye/routing/admin.ts"

export function getEnvoyeRouteChildren() {
	return [
		indexRoute,
		workspaceSetupRoute,
		existingWorkspaceSetupRoute,
		signupRoute,
		loginRoute,
		acceptInviteRoute,
		checkEmailRoute,
		workspaceRouteTree,
		adminRouteTree,
	]
}
