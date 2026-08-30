import useTeammates from "@envoye/features/directory/api/teammates.ts"
import { fullName } from "@envoye/features/directory/utils/teammate.ts"
import type { Teammate } from "@envoye/features/workspace/interface/teammate.interface.ts"

export default function useTeammateFullNameSearch(code: string) {
	const { data: teammates } = useTeammates(code)
	return (name: string): Teammate[] => {
		if (name.trim().length === 0) {
			return teammates ?? []
		}
		return (teammates ?? []).filter((teammate) =>
			fullName(teammate).toLowerCase().includes(name.toLowerCase()),
		)
	}
}
