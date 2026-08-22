import { SplitLayout } from "@common/components/split-layout.tsx"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@common/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
	type TeammateDetails,
	teammateDetailSchema,
} from "@envoye/features/workspace/schema/teammate-details.ts"
import { Input } from "@common/components/ui/input.tsx"
import { useNavigate, useSearch } from "@tanstack/react-router"
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@common/components/ui/empty.tsx"
import { Spinner } from "@common/components/ui/spinner.tsx"
import { Progress } from "@common/components/ui/progress.tsx"
import React from "react"
import { useFakeProgress } from "@common/hooks/use-fake-progress.ts"
import { useVerifyInvite } from "@envoye/features/workspace/api/verify-invite.ts"
import { Button } from "@common/components/ui/button.tsx"
import { InvalidInviteScreen } from "@envoye/features/workspace/invalid-invite-screen.tsx"
import { Pages } from "@common/utils/pages.ts"
import { CHECK_MAIL_REASON } from "@common/constants.ts"
import { useAcceptInvite } from "@envoye/features/workspace/api/accept-invite.ts"
import { useDebounce } from "@common/hooks/use-debounce.ts"
import { useCheckUsername } from "./api/check-username.ts"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@common/components/ui/input-group"
import UsernameStateIcon from "@envoye/features/workspace/components/username-state-icon.tsx"
import usernameCheckMessage from "@envoye/features/workspace/utils/username-check-message.ts"

const LAG_MS = 2500

export function AcceptInvite() {
	const { inviteCode } = useSearch({ from: "/workspace-invite" })

	const [verificationCompleted, setVerificationCompleted] =
		React.useState(false)
	const [verificationError, setVerificationError] = React.useState(false)

	const inviteQuery = useVerifyInvite(inviteCode)
	const { mutate: acceptInvite, isPending } = useAcceptInvite()
	const progress = useFakeProgress(verificationCompleted)
	const navigate = useNavigate()

	const form = useForm<TeammateDetails>({
		resolver: zodResolver(teammateDetailSchema),
		mode: "onChange",
		defaultValues: {
			firstName: "",
			lastName: "",
			username: "",
			email: "",
		},
	})

	React.useEffect(() => {
		const timer = setTimeout(() => {
			if (inviteQuery.isSuccess) {
				setVerificationCompleted(true)
				form.setValue("email", inviteQuery.data.recipientEmail)
			} else if (inviteQuery.isError) {
				setVerificationError(true)
			}
		}, LAG_MS)

		return () => clearTimeout(timer)
	}, [
		inviteQuery.isSuccess,
		inviteQuery.isError,
		inviteQuery.data?.recipientEmail,
		form.setValue,
	])

	const username = form.watch("username")
	const debouncedUsername = useDebounce(username, 300)
	const workspaceCode = inviteQuery.data?.workspaceCode ?? ""
	const usernameQuery = useCheckUsername(debouncedUsername, workspaceCode)

	function onSubmit(values: TeammateDetails) {
		const decodedData = inviteQuery.data

		if (!decodedData) {
			setVerificationError(true)
			return
		}

		acceptInvite(
			{
				workspaceCode: decodedData.workspaceCode,
				inviteCode: decodedData.inviteCode,
				teammateEmail: decodedData.recipientEmail,
				firstName: values.firstName,
				lastName: values.lastName,
				username: values.username,
			},
			{
				onSuccess: () => {
					navigate({
						to: Pages.CHECK_EMAIL,
						search: {
							email: values.email,
							type: CHECK_MAIL_REASON.INVITE_ACCEPTED_SUCCESS,
						},
					})
				},
				onError: () => {
					setVerificationError(true)
				},
			},
		)
	}

	if (verificationError) {
		return <InvalidInviteScreen />
	}

	if (verificationCompleted) {
		return (
			<SplitLayout>
				<div className="flex flex-1 flex-col md:justify-center items-center  px-6 py-10 sm:px-10 md:px-12 lg:px-14">
					<div className="mb-8 w-full max-w-md">
						<h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
							Welcome to the Team 🎉
						</h1>
						<p className="mt-2 text-sm text-neutral-500 sm:text-base">
							{"A couple more details to help you join the conversation"}
						</p>
					</div>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="flex w-full max-w-md flex-col gap-5 "
						>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem className="gap-2">
										<FormLabel className="font-semibold text-neutral-800">
											Email
										</FormLabel>
										<FormControl>
											<Input
												data-testid="email"
												className="signup-field-input"
												disabled
												{...field}
											/>
										</FormControl>
										<FormMessage data-testid="teammate-email-form-message" />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="firstName"
								render={({ field }) => (
									<FormItem className="gap-2">
										<FormLabel className="font-semibold text-neutral-800">
											First Name
										</FormLabel>
										<FormControl>
											<Input
												data-testid="teammate-first-name"
												placeholder="John"
												className="signup-field-input"
												{...field}
											/>
										</FormControl>
										<FormMessage data-testid="teammate-firstname-form-message" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem className="gap-2">
										<FormLabel className="font-semibold text-neutral-800">
											Last Name
										</FormLabel>
										<FormControl>
											<Input
												data-testid="teammate-last-name"
												placeholder="Doe"
												className="signup-field-input"
												{...field}
											/>
										</FormControl>
										<FormMessage data-testid="teammate-lastname-form-message" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem className="gap-2">
										<FormLabel className="font-semibold text-neutral-800">
											Username
										</FormLabel>
										<FormControl>
											<InputGroup>
												<InputGroupInput
													data-testid="teammate-username"
													placeholder="john.doe"
													className="signup-field-input"
													{...field}
												/>
												<InputGroupAddon align="inline-end">
													{username && (
														<UsernameStateIcon query={usernameQuery} />
													)}
												</InputGroupAddon>
											</InputGroup>
										</FormControl>
										<FormMessage
											className="text-xs"
											data-testid="teammate-username-form-message"
										>
											{usernameCheckMessage(usernameQuery, username)}
										</FormMessage>
										<FormDescription className="text-xs text-neutral-500">
											This is how teammates will see you. Keep it simple and
											easy to find, something like{" "}
											<code className="bg-gray-100 px-1 rounded">
												first.lastname
											</code>{" "}
											works great!
										</FormDescription>
									</FormItem>
								)}
							/>

							<Button
								disabled={
									!form.formState.isValid ||
									isPending ||
									!usernameQuery.isSuccess
								}
								type="submit"
								className="mt-2 h-11 w-full cursor-pointer rounded-lg bg-[#1A1C23] text-white hover:bg-[#1A1C23]/90"
								data-testid="submit-button"
							>
								{isPending ? "Setting up...." : "Join Workspace"}
							</Button>
						</form>
					</Form>
				</div>
			</SplitLayout>
		)
	}

	return (
		<Empty className="w-full min-h-screen justify-center items-center border-0">
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<Spinner />
				</EmptyMedia>
				<EmptyTitle>Doing Some Cool Stuff</EmptyTitle>
				<EmptyDescription>
					Please wait while we verify your invite...
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Progress value={progress} />
			</EmptyContent>
		</Empty>
	)
}
