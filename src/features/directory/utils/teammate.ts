import sentenceCase from "@/utils/sentence-case.ts"
import {
	type Role,
	ROLES,
	type Teammate,
} from "@/features/workspace/interface/teammate.interface.ts"

export const fallBackRole: Role = {
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
