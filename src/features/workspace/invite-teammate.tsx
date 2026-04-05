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
import { useSendWorkspaceInvite } from "@/features/workspace/api/send-invite.ts"
import { useSearch } from "@tanstack/react-router"
import { ROLES } from "@/constants.ts"
import { toast } from "sonner"

export const MAX_INVITE_EMAIL_ENTRIES = 10

export function TeammateInviteModal({
	open,
	onOpenChange,
}: { open: boolean; onOpenChange: (open: boolean) => void }) {
	const { t } = useTranslation("workspace")
	const { code } = useSearch({ from: "/workspace" })
	const { mutate: sendInvite } = useSendWorkspaceInvite()

	const [emailEntries, setEmailEntries] = useState<EmailEntry[]>([])
	const [inviteAsWorkspaceAdmin, setInviteAsWorkspaceAdmin] = useState(true)

	const handleInvite = () => {
		onOpenChange(false)
		sendInvite(
			{
				code: code,
				emails: emailEntries
					.slice(0, MAX_INVITE_EMAIL_ENTRIES)
					.map((entry) => entry.email),
				role: inviteAsWorkspaceAdmin
					? ROLES.WorkspaceAdmin
					: ROLES.SupportStaff,
			},
			{
				onError: (e) => {
					toast.error("Unable to invite teammates to workspace")
					console.error(e)
				},
			},
		)
	}

	const handleCancel = () => {
		onOpenChange(false)
	}

	useEffect(() => {
		const closed = !open
		if (closed) setEmailEntries([])
	}, [open])

	const isDisabled =
		emailEntries.length === 0 || emailEntries.length > MAX_INVITE_EMAIL_ENTRIES

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="sm:max-w-md
                data-[state=open]:animate-in
                data-[state=closed]:animate-out
                data-[state=open]:fade-in-10
                data-[state=closed]:fade-out-10
                data-[state=open]:zoom-in-95
                data-[state=closed]:zoom-out-95
                duration-500"
			>
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
						emailEntries={emailEntries}
						setEmailEntries={setEmailEntries}
						placeholder={
							emailEntries.length === 0
								? t("inviteTeammate.placeholder")
								: "Enter email"
						}
						disabled={false}
						maxEmailEntries={MAX_INVITE_EMAIL_ENTRIES}
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
							data-testid="send-workspace-invite-button"
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
