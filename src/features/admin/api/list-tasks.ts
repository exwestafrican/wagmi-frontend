import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client.ts"
import { ApiPaths } from "@/constants.ts"

export type Task = {
	jobId: string
	name: string
	description: string
}

export const TASKS = "tasks"

export function useTasks(workspaceCode: string) {
	return useQuery<Task[]>({
		queryKey: [TASKS, workspaceCode],
		queryFn: async () => {
			const res = await apiClient.get<Task[]>(ApiPaths.TASKS, {
				params: { workspaceCode },
			})
			return res.data
		},
		staleTime: Number.POSITIVE_INFINITY,
	})
}
