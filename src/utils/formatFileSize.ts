import type { StatementFile } from "@/features/file-upload/types/statementFile"

export function formatFileSize(file: StatementFile) {
	const mbSize = file.size / (1024 * 1024)
	const kbSize = file.size / 1024
	if (kbSize >= 1024) {
		return `${mbSize.toFixed(2)} MB`
	}
	return `${kbSize.toFixed(2)} KB`
}
