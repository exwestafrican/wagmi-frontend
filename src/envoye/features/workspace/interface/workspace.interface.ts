export enum WorkspaceStatus {
	ACTIVE = "ACTIVE",
	DISABLED = "DISABLED",
	DELETED = "DELETED",
}
export interface Workspace {
	code: string
	status: WorkspaceStatus
	name: string
}
