import { Badge } from "@/components/ui/badge.tsx"
import { Button } from "@/components/ui/button"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table.tsx"
import { type Task, useTasks } from "@/features/admin/api/list-tasks.ts"
import {
	type RunTaskSummary,
	useRunTask,
} from "@/features/admin/api/run-task.ts"
import { isAxiosError } from "axios"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"

function notifyRunResult(summary: RunTaskSummary) {
	const { status, workspacesProcessed, workspacesSucceeded, workspacesFailed } =
		summary

	if (status === "success") {
		toast.success(
			`Backfill complete — ran on ${workspacesProcessed} workspaces.`,
		)
		return
	}

	if (status === "partial") {
		toast.warning(
			`Ran on ${workspacesSucceeded} of ${workspacesProcessed} workspaces, ${workspacesFailed} failed.`,
		)
		return
	}

	toast.error(`Backfill failed on all ${workspacesProcessed} workspaces.`)
}

function notifyRunError(error: unknown) {
	if (isAxiosError(error) && error.response?.status === 404) {
		toast.error("That backfill job doesn't exist.")
		return
	}

	toast.error("Couldn't run backfill job. Please try again.")
}

export default function AdminBackfillPage() {
	const { data: tasks, isSuccess } = useTasks()
	const { mutate: runTask, isPending, variables: runningJobId } = useRunTask()

	const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)

	useEffect(() => {
		const hasTasks = (tasks ?? []).length > 0
		if (isSuccess && hasTasks) {
			setSelectedTask(tasks[0])
		}
	}, [isSuccess, tasks])

	function handleRun(jobId: string) {
		if (isPending) return
		runTask(jobId, {
			onSuccess: notifyRunResult,
			onError: notifyRunError,
		})
	}

	return (
		<div className="p-8 flex justify-start flex-col">
			<div className="md:size-7/12">
				<h1 className="text-2xl font-semibold mb-6">Backfill</h1>
				<Table>
					<TableHeader>
						<TableRow>
							{["name", "job id", "description", "actions"].map((header) => (
								<TableHead
									key={header}
									className="text-xs capitalize text-left"
								>
									{header}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{tasks?.map((task) => {
							const isRunning = isPending && runningJobId === task.jobId
							return (
								<TableRow
									key={task.jobId}
									data-state={
										selectedTask?.jobId === task.jobId ? "selected" : undefined
									}
									onClick={() => setSelectedTask(task)}
									className="cursor-pointer"
								>
									<TableCell className="whitespace-normal break-words min-w-0 max-w-md text-xs">
										{task.name}
									</TableCell>
									<TableCell className="text-left whitespace-normal break-words min-w-0 max-w-md">
										<Badge
											variant="outline"
											className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
										>
											{task.jobId}
										</Badge>
									</TableCell>
									<TableCell className="whitespace-normal break-words min-w-0 max-w-md text-xs">
										{task.description}
									</TableCell>
									<TableCell className="text-left whitespace-normal break-words min-w-0 max-w-md">
										<Button
											variant="outline"
											size="sm"
											className="min-w-28 cursor-pointer text-xs"
											disabled={isPending}
											onClick={() => handleRun(task.jobId)}
										>
											{isRunning ? (
												<>
													<Loader2 className="animate-spin" />
													Running…
												</>
											) : (
												"Run job"
											)}
										</Button>
									</TableCell>
								</TableRow>
							)
						})}
					</TableBody>
				</Table>
			</div>
		</div>
	)
}
