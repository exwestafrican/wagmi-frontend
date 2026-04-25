import { useSearch } from "@tanstack/react-router"
import { useTasks } from "@/features/jobs/api/list-tasks.ts"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table.tsx"
import { MoreHorizontalIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx"

export function BackfillJobsPage() {
	const { code } = useSearch({ from: "/workspace" })
	const { data: tasks } = useTasks(code)

	return (
		<div className="p-8 size-9/12">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Job ID</TableHead>
						<TableHead>Name</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{tasks?.map((task) => (
						<TableRow key={task.jobId}>
							<TableCell>{task.jobId}</TableCell>
							<TableCell>{task.name}</TableCell>
							<TableCell>{task.description}</TableCell>
							<TableCell className="text-right">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant="ghost"
											size="icon"
											className="size-8 cursor-pointer"
										>
											<MoreHorizontalIcon />
											<span className="sr-only">Open menu</span>
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem className="cursor-pointer">
											Run
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
