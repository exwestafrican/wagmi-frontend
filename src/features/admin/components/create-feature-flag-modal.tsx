import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { useForm, useFormState } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useCreateFeatureFlag } from "@/features/admin/api/create-feature-flag"
import {
	createFeatureFlagSchema,
	type CreateFeatureFlagFormValues,
} from "@/features/admin/schema/create-feature-flag-schema"
import { toast } from "sonner"

const defaultValues: CreateFeatureFlagFormValues = {
	name: "",
	key: "",
	description: "",
}

export function CreateFeatureFlagModal({
	open,
	onOpenChange,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
}) {
	const { mutate, isPending } = useCreateFeatureFlag()
	const form = useForm<CreateFeatureFlagFormValues>({
		resolver: zodResolver(createFeatureFlagSchema),
		defaultValues,
		mode: "onChange",
	})
	const { isValid } = useFormState({ control: form.control })

	function handleOpenChange(open: boolean) {
		if (!open) {
			form.reset(defaultValues)
		}
		onOpenChange(open)
	}

	function onSubmit(values: CreateFeatureFlagFormValues) {
		mutate(values, {
			onSuccess: () => {
				toast.success("Feature flag created")
				form.reset(defaultValues)
				onOpenChange(false)
			},
			onError: () => {
				toast.error("Could not create feature flag")
			},
		})
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent
				data-testid="create-feature-flag-modal"
				className="sm:max-w-lg"
			>
				<DialogHeader>
					<DialogTitle>Create feature flag</DialogTitle>
				</DialogHeader>
				<DialogDescription className="sr-only">
					Enter name, key, and description for a new feature flag.
				</DialogDescription>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="space-y-4"
						data-testid="create-feature-flag-form"
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											className="signup-field-input"
											autoComplete="off"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="key"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Key</FormLabel>
									<FormControl>
										<Input
											className="signup-field-input"
											autoComplete="off"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											className="signup-field-input min-h-[100px] resize-y"
											rows={4}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => handleOpenChange(false)}
								disabled={isPending}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={isPending || !isValid}>
								{isPending ? "Vrooming…" : "Create"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
