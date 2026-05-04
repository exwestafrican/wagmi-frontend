import { useSearch } from "@tanstack/react-router"
import { useTasks } from "@/features/admin/api/list-tasks.ts"
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
import { Badge } from "@/components/ui/badge.tsx"

export function BackfillJobsPage() {
	const { code } = useSearch({ from: "/workspace" })
	const { data: tasks } = useTasks(code)

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
						{tasks?.map((task) => (
							<TableRow key={task.jobId}>
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
											<DropdownMenuItem className="cursor-pointer text-xs capitalize">
												run job
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
