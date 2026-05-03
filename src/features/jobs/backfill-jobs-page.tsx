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
		<div className="p-8 flex justify-start flex-col">
			<div className="size-8/12">
				<h1 className="text-2xl font-semibold mb-6">Backfill</h1>
				<Table>
					<TableHeader>
						<TableRow>
                            <TableHead>Name</TableHead>
							<TableHead>Job ID</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{tasks?.map((task) => (
							<TableRow key={task.jobId}>
								<TableCell className="whitespace-normal break-words min-w-0 max-w-md">{task.name}</TableCell>
                                <TableCell className="whitespace-normal break-words min-w-0 max-w-md">{task.jobId}</TableCell>
								<TableCell className="whitespace-normal break-words min-w-0 max-w-md">{task.description}</TableCell>
								<TableCell className="text-right whitespace-normal break-words min-w-0 max-w-md">
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
		</div>
	)
}
