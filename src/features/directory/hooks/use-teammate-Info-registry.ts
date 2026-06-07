import useTeammates from "@/features/directory/api/teammates.ts"
import indexBy from "@/utils/indexed-by.ts"

export default function useTeammateInfoRegistry(code: string) {
	const { data: teammates } = useTeammates(code)
	const indexedTeammates = indexBy(teammates ?? [], (teammate) => teammate.id)
	return {
		find: (teammateId: number) => {
			return indexedTeammates.get(teammateId)
		},
	}
}
