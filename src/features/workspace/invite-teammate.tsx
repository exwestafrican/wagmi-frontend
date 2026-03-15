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
import {
	EmailPillInput,
	type EmailEntry,
} from "@/features/workspace/email-pill-input"
import { Label } from "@/components/ui/label.tsx"
import { Checkbox } from "@/components/ui/checkbox"

export function TeammateInviteModal({
	open,
	onOpenChange,
}: { open: boolean; onOpenChange: (open: boolean) => void }) {
	const [emails, setEmails] = useState<EmailEntry[]>([])
	const [inviteAsWorkspaceAdmin, setInviteAsWorkspaceAdmin] = useState(true)

	const handleInvite = () => {
		// TODO: API call to invite emails (emails.map((e) => e.email))
		onOpenChange(false)
	}

	const handleCancel = () => {
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
					<DialogTitle className={"self-start"}>Invite Teammates</DialogTitle>
				</DialogHeader>
				<DialogDescription
					data-testid="teammate-invite-dialog-description"
					className="sr-only"
				>
					{/*sr-only makes test invisible*/}
					Enter email of Teammate
				</DialogDescription>
				<div>
					<span className={"text-muted-foreground text-sm"}>
						{" "}
						Enter email of Teammate
					</span>
					<EmailPillInput
						emails={emails}
						setEmails={setEmails}
						placeholder={"someonecool@useenvoye.co"}
						disabled={false}
					/>
				</div>

				<DialogFooter className="justify-between sm:justify-between align-middle flex-col sm:flex-col">
					<div className="flex items-center space-x-2">
						<Checkbox
							checked={inviteAsWorkspaceAdmin}
							onCheckedChange={() => setInviteAsWorkspaceAdmin((prev) => !prev)}
							id="is-workspace-admin"
						/>
						<Label
							className={"text-[10px] tracking-tight leading-tight"}
							htmlFor="is-workspace-admin"
						>
							Invite as Admin
						</Label>
					</div>
					<div className="flex self-end items-center space-x-2">
						<Button
							type="button"
							variant="ghost"
							onClick={handleCancel}
							className="cursor-pointer"
						>
							Cancel
						</Button>

						<Button
							type="button"
							disabled={isDisabled}
							variant="outline"
							onClick={handleInvite}
							className="hover:scale-105 transition duration-200 ease-out cursor-pointer text-white hover:text-white bg-black hover:bg-black/75"
						>
							Send Invite
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
