import { useQuery } from "@tanstack/react-query"
import { adminApiClient } from "@/lib/admin-api-client.ts"
import { AdminApiPaths } from "@/constants.ts"

export type Task = {
	jobId: string
	name: string
	description: string
}

export const TASKS = "tasks"

export function useTasks() {
	return useQuery<Task[]>({
		queryKey: [TASKS],
		queryFn: async () => {
			const res = await adminApiClient.get<Task[]>(AdminApiPaths.LIST_TASKS)
			return res.data
		},
		staleTime: Number.POSITIVE_INFINITY,
	})
}
