import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useJoinWaitList } from "@/features/waitlist/api/useJoinWaitlist"

const formSchema = z.object({
	email: z
		.email({
			message: "Please enter a valid email address.",
		})
		.trim()
		.toLowerCase(),
})

const JoinWaitListForm = () => {
	const { mutate: joinWaitList, isPending } = useJoinWaitList()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: { email: "" },
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		joinWaitList(values.email, {
			onSuccess: () => {
				form.reset()
			},
		})
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="flex items-center gap-3 border-b border-border pb-3">
									<Input
										className="bg-transparent border-0 shadow-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0  placeholder:text-foreground/40"
										placeholder="Enter your email..."
										{...field}
									/>
									<Button
										className="cursor-pointer bg-black text-white hover:bg-black/90"
										type="submit"
										disabled={isPending}
									>
										{isPending ? "Joining..." : "Get Notified"}
									</Button>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	)
}

export default JoinWaitListForm
