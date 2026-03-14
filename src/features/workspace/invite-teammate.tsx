import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { EmailPillInput } from "@/features/workspace/email-pill-input"
import { Switch } from "@/components/ui/switch.tsx"
import { Label } from "@/components/ui/label.tsx"

export function TeammateInviteModal({
	open,
	onOpenChange,
}: { open: boolean; onOpenChange: (open: boolean) => void }) {
	const [emails, setEmails] = useState<string[]>([])
	const [inviteAsWorkspaceAdmin, setInviteAsWorkspaceAdmin] = useState<
		boolean | undefined
	>(true)

	const handleInvite = () => {
		// TODO: API call to invite emails
		console.log("Inviting:", emails)
		onOpenChange(false)
	}

	useEffect(() => {
		const closed = !open
		if (closed) setTimeout(() => setEmails([]), 500) //this makes clearing look better
	}, [open])

	const isDisabled = emails.length === 0

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Invite Teammates</DialogTitle>
				</DialogHeader>
				<DialogDescription>Enter email of Teammates</DialogDescription>
				<EmailPillInput
					emails={emails}
					setEmails={setEmails}
					placeholder={"someonecool@useenvoye.co"}
					disabled={false}
				/>
				<DialogFooter className="justify-between sm:justify-between align-middle flex-col">
					<div className="flex items-center space-x-2">
						<Switch
							checked={inviteAsWorkspaceAdmin}
							onClick={() =>
								setInviteAsWorkspaceAdmin((prevState) => !prevState)
							}
							id="is-worksapce-admin"
						/>
						<Label
							className={"text-[10px] tracking-tight leading-tight"}
							htmlFor="is-worksapce-admin"
						>
							Invite as Workspace Admin
						</Label>
					</div>
					<Button
						type="button"
						disabled={isDisabled}
						variant="outline"
						onClick={handleInvite}
						className={` hover:scale-105 transition duration-200 ease-out cursor-pointer text-white hover:text-white bg-black hover:bg-black/75`}
					>
						Send Invite
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
