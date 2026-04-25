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
		backgroundColor: "#FFF3C4", // soft amber
		colorCode: "#7A5B00", // rich amber text
	},
	SupportStaff: {
		name: "Support Member",
		emoji: "🎧",
		backgroundColor: "#E6F0FF", // lighter, cleaner blue
		colorCode: "#1D4ED8", // accessible blue
	},
	SuperAdmin: {
		name: "Super Admin",
		emoji: "👨🏾‍💻",
		backgroundColor: "#FDE2E4", // soft red/pink
		colorCode: "#9B1C1C", // deep red
	},
}

const fallBackRole: Role = {
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
