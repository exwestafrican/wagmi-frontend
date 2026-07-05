import { Spinner } from "@/components/ui/spinner.tsx"

export function WorkspacePending() {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<Spinner className="size-8" />
		</div>
	)
}
