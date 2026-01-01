import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import z from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function EmailRequestModal({
	open,
	onOpenChange,
	onSubmitEmailRequest,
}: {
	open: boolean
	onOpenChange: (open: boolean) => void
	onSubmitEmailRequest: (email: string) => void
}) {
	const formSchema = z.object({
		email: z
			.email({ message: "Please enter a valid email address." })
			.trim()
			.toLowerCase()
			.nonempty({
				message: "Email cannot be empty",
			}),
	})

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { email: "" },
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		onSubmitEmailRequest(values.email)
		form.reset()
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent data-testid="email-request-modal" className="sm:max-w-sm">
				<DialogHeader>
					<DialogTitle>Envoye</DialogTitle>
				</DialogHeader>
				<DialogDescription data-testid="dialog-description" className="sr-only">
					Enter your email to submit a feature request.
				</DialogDescription>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						data-testid="email-request-form"
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<div className="space-y-4">
											<Input
												placeholder="Enter your email"
												{...field}
												autoFocus
												data-testid="email-request-input"
											/>
											<Button
												type="submit"
												disabled={!form.formState.isValid}
												size="icon"
												variant="outline"
												className="cursor-pointer w-full bg-black text-white hover:bg-black/80 hover:text-white"
												data-testid="email-request-submit-button"
											>
												Submit
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
