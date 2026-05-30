import { AdminApiPaths } from "@/constants.ts"
import { adminApiClient } from "@/lib/admin-api-client.ts"
import { useMutation } from "@tanstack/react-query"

export type RunTaskStatus = "success" | "partial" | "failure"

export type RunTaskSummary = {
	jobId: string
	status: RunTaskStatus
	workspacesProcessed: number
	workspacesSucceeded: number
	workspacesFailed: number
}

export function useRunTask() {
	return useMutation<RunTaskSummary, unknown, string>({
		mutationFn: async (jobId: string) => {
			const res = await adminApiClient.post<RunTaskSummary>(
				`${AdminApiPaths.LIST_TASKS}/${jobId}/run`,
			)
			return res.data
		},
	})
}
