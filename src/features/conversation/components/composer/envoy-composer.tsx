import { Field } from "@/components/ui/field.tsx"
import { forwardRef, useState } from "react"
import { Button } from "@/components/ui/button.tsx"
import { SendHorizontal } from "lucide-react"
import { cn } from "@/lib/utils.ts"
import useTextNodeParser from "@/features/conversation/hooks/text-node.tsx"
import type { TextNode } from "@/features/conversation/interface/text-node.ts"
import { DESKTOP_KEYS } from "@/constants.ts"

const MAX_TEXT_INPUT = 2000

type EnvoyComposerProps = {
	onSend: (nodes: TextNode[]) => void
}

const EnvoyComposer = forwardRef<HTMLTextAreaElement, EnvoyComposerProps>(
	function EnvoyComposer({ onSend }, ref) {
		const [textInput, setTextInput] = useState("")

		const parser = useTextNodeParser()

		const hasNoInput = textInput.length === 0
		const exceedsTextInput = textInput.length > MAX_TEXT_INPUT

		const invalidInput = textInput.length > MAX_TEXT_INPUT
		const disableSend = hasNoInput || exceedsTextInput

		function sendMessage() {
			setTextInput("")
			onSend(parser.build())
		}
		return (
			<Field
				className={cn(
					"w-full",
					" border-zinc-200 border",
					"rounded-md",
					"shadow-sm",
				)}
			>
				<textarea
					aria-label="message-composer"
					ref={ref}
					value={textInput}
					maxLength={MAX_TEXT_INPUT}
					className="w-full bg-transparent border-none outline-none focus:outline-none text-sm placeholder:text-gray-400 resize-none px-5 pt-3 pb-2 min-h-[70px] font-normal leading-relaxed  font-sans"
					placeholder="Message Raymond..." //TODO pass this as an argument
					onChange={(e) => {
						parser.setText(e.target.value)
						setTextInput(e.target.value)
					}}
					onKeyDown={(e) => {
						switch (e.key) {
							case DESKTOP_KEYS.ENTER:
								e.preventDefault()
								sendMessage()
								break
							default:
								break
						}
					}}
				/>
				<div className="flex flex-row gap-4 items-center justify-end px-3 pb-2 pt-0">
					<span
						className={cn(
							"text-xs",
							invalidInput ? "text-red-600" : "text-gray-400",
						)}
					>
						{textInput.length}/{MAX_TEXT_INPUT}
					</span>

					<Button
						aria-label="send-message"
						size="icon-sm"
						className=" w-11 h-7 bg-[#c15f3c]  hover:bg-[#c15f3c]/90"
						disabled={disableSend}
						onClick={() => sendMessage()}
					>
						<SendHorizontal />
					</Button>
				</div>
			</Field>
		)
	},
)

export default EnvoyComposer
