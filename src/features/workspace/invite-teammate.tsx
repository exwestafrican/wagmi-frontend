import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label.tsx"
import {
	type EmailEntry,
	EmailPillInput,
} from "@/features/workspace/email-pill-input"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

export function TeammateInviteModal({
	open,
	onOpenChange,
}: { open: boolean; onOpenChange: (open: boolean) => void }) {
	const { t } = useTranslation("workspace")
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
					<DialogTitle className={"self-start"}>
						{t("inviteTeammate.title")}
					</DialogTitle>
				</DialogHeader>
				<DialogDescription
					data-testid="teammate-invite-dialog-description"
					className="sr-only"
				>
					{/*sr-only makes test invisible*/}
					{t("inviteTeammate.description")}
				</DialogDescription>
				<div>
					<span className={"text-muted-foreground text-sm"}>
						{" "}
						{t("inviteTeammate.description")}
					</span>
					<EmailPillInput
						emails={emails}
						setEmails={setEmails}
						placeholder={t("inviteTeammate.placeholder")}
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
							{t("inviteTeammate.inviteAsAdmin")}
						</Label>
					</div>
					<div className="flex self-end items-center space-x-2">
						<Button
							type="button"
							variant="ghost"
							onClick={handleCancel}
							className="cursor-pointer"
						>
							{t("inviteTeammate.cancel")}
						</Button>

						<Button
							type="button"
							disabled={isDisabled}
							variant="outline"
							onClick={handleInvite}
							className="hover:scale-105 transition duration-200 ease-out cursor-pointer text-white hover:text-white bg-black hover:bg-black/75"
						>
							{t("inviteTeammate.sendInvite")}
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
