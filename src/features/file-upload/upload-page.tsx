import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileSpreadsheet, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useRef } from "react"
import { formatFileSize } from "@/utils/formatFileSize"
import { usePostStatement } from "@/features/file-upload/api/usePostStatement"
import { useQuery } from "@tanstack/react-query"
import type { StatementFile } from "@/features/file-upload/types/statementFile"

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3 // 3MB

function UploadPage() {
	const jsonData = JSON.stringify(
		{
			app: {
				name: "Wagmi",
				version: "1.0.0",
				description:
					"🧘🏾‍♂️ Lets figure out what your bank statements say about you 💰",
			},
			userMeta: {
				generatedAt: new Date().toISOString(),
				timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
				viewport: {
					width: window.innerWidth,
					height: window.innerHeight,
				},
			},
			author: {
				name: "WaggzzCorp",
				message: "Built with ❤️ for finance",
				year: new Date().getFullYear(),
			},
		},
		null,
		2,
	)

	const schema = z
		.array(
			z
				.instanceof(File, { message: "Must be a file" })
				.refine((file) => file.size <= MAX_UPLOAD_SIZE, {
					message: "File size must be less than 3MB",
				}),
		)
		.nonempty({ message: "Please select at least one file" }) //

	const { data: uploadedFiles = [] } = useQuery<StatementFile[]>({
		queryKey: ["uploads"] as const,
		queryFn: () => [], // This will be populated by setQueryData in onSuccess
		initialData: [],
	})

	const { mutate: uploadMutation } = usePostStatement()

	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleUploadClick = () => {
		fileInputRef.current?.click()
	}

	function onChange(fileList: FileList | null) {
		if (fileList) {
			const files = Array.from(fileList)
			const result = schema.safeParse(files)

			if (result.success) {
				console.log("File is valid")
				// Start upload - onSuccess will update with real ID from backend
				uploadMutation(files[0])
			} else {
				console.log("File is invalid", result.error)
				// alert the user we could not upload file
				// make an api call to log error TODO: log-error-backend
			}
		}
	}

	return (
		<div className="flex flex-row gap-10 p-10 bg-gray-100 h-screen justify-between ">
			<div className="basis-2/3">
				<pre id="json">{jsonData}</pre>
			</div>
			<div className="flex flex-col basis-1/3">
				<Card className="w-full max-w-96">
					<CardHeader>
						<CardTitle>Upload File</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-col gap-4">
						{/* Files upload section */}
						<Input
							ref={fileInputRef}
							type="file"
							id="file-upload"
							className="hidden"
							accept=".xlsx"
							onChange={(e) => {
								onChange(e.target.files)
							}}
						/>
						<button
							type="button"
							onClick={handleUploadClick}
							className="gap-2 cursor-pointer bg-gray-200 flex flex-col justify-center items-center text-center p-8 rounded-lg border-2 border-dashed border-gray-400 hover:border-blue-500 transition-colors"
						>
							<Upload />
							<p className="font-semibold">
								Drop or Select Statement to Upload
							</p>
							<p className="text-xs text-gray-500 font-medium">
								Drop Statement here or click to browse through your machine
							</p>
						</button>

						{/* Files uploaded */}
						<div className="flex flex-col gap-2">
							{uploadedFiles.map((file) => (
								<div
									className="flex flex-row justify-between items-center rounded-lg border-2 border-dashed border-gray-200 p-2 cursor-pointer gap-2 hover:bg-gray-50"
									key={file.id}
								>
									<FileSpreadsheet className="w-6 h-6" />

									<div className="w-5/6 truncate ">
										<p className="text-sm font-semibold truncate w-3/4">
											{file.name}
										</p>
										<p className="text-sm font-semibold text-gray-500">
											{formatFileSize(file)}
										</p>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}

export default UploadPage
