import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileSpreadsheet, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useRef, useState } from "react";
import { formatFileSize } from "@/utils/formatFileSize";

const MAX_UPLOAD_SIZE = 1024 * 1024 * 3; // 3MB

function App() {
	const jsonData = JSON.stringify(
		{
			dates: [
				{
					date: "2025-01-01",
					events: [
						{
							name: "Event 1",
							description: "Description 1",
						},
					],
				},
			],
		},
		null,
		2,
	);

	const schema = z
		.array(
			z
				.instanceof(File, { message: "Must be a file" })
				.refine((file) => file.size <= MAX_UPLOAD_SIZE, {
					message: "File size must be less than 3MB",
				}),
		)
		.nonempty({ message: "Please select at least one file" }); //

	interface StatementFile {
		id: string | null;
		file: File;
		uploaded: boolean;
	}

	const [statementFiles, setStatementFiles] = useState<StatementFile[]>([]);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	function handleUpload(file: File) {
		const statementFile: StatementFile = {
			id: null,
			file: file,
			uploaded: false,
		};
		setStatementFiles([statementFile]); // clear all previous files because we only support one document.

		// make an api call to upload the file
		// if successful set new id
		// else delete the file from the state
	}

	function onChange(fileList: FileList | null) {
		if (fileList) {
			const files = Array.from(fileList);
			const result = schema.safeParse(files);

			if (result.success) {
				console.log("File is valid");
				//handle file upload. we only ever need to upload one file at at time.
				handleUpload(files[0]);
			} else {
				console.log("File is invalid", result.error);
				// alert the user we could not upload file
				// make an api call to log error TODO: log-error-backend
			}
		}
	}

	return (
		<div className="flex flex-row gap-10 p-10 bg-gray-100 h-screen">
			<div className="basis-2/3">
				<pre id="json">{jsonData}</pre>
			</div>
			<div className="flex flex-col basis-1/3">
				<Card className="w-3/6 ">
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
								onChange(e.target.files);
							}}
						/>
						<div
							onClick={handleUploadClick}
							className="gap-2  cursor-pointer bg-gray-200 flex flex-col justify-center items-center text-center  p-8 rounded-lg border-2 border-dashed border-gray-400 hover:border-blue-500 transition-colors"
						>
							<Upload />
							<p className="font-semibold">
								Drop or Select Statement to Upload
							</p>
							<p className="text-xs text-gray-500 font-medium">
								Drop Statement here or click to browse through your machine
							</p>
						</div>

						{/* Files uploaded */}
						<div className="flex flex-col gap-2">
							{statementFiles.map(({ id, file }) => (
								<div
									className="flex flex-row justify-between items-center rounded-lg border-2 border-dashed border-gray-200 p-2 cursor-pointer gap-2 hover:bg-gray-50"
									key={id}
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
	);
}

export default App;
