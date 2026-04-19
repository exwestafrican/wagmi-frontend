import sentenceCase from "@/utils/sentence-case.ts"

export interface Teammate {
	id: number
	email: string
	username: string
	firstName: string
	lastName: string
	role: string
}

export interface Role {
	name: string
	emoji: string
	backgroundColor: string
	colorCode: string
}

const ROLES: Record<string, Role> = {
	WorkspaceAdmin: {
		name: "Workspace Owner",
		emoji: "👀",
		backgroundColor: "#fff8bb",
		colorCode: "#5a5854",
	},
	SupportStaff: {
		name: "Support Member",
		emoji: "🎧",
		backgroundColor: "#d9e6ff",
		colorCode: "#003d8b",
	},
}

const fallBackRole = {
	name: "Unknown Role",
	emoji: "💪🏾",
	backgroundColor: "#fff8bb",
	colorCode: "#5a5854",
}

export function fullName(teammate: Teammate) {
	return [teammate.firstName, teammate.lastName]
		.map((n) => sentenceCase(n))
		.join(" ")
}

export function buildTeammateRole(teammate: Teammate) {
	if (ROLES[teammate.role] === undefined) {
		return fallBackRole
	}
	return ROLES[teammate.role]
}

export function formatRole(role: Role) {
	return `${role.emoji} ${role.name}`
}
