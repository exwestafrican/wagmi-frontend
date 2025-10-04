import { describe, expect, test } from "vitest"
import { formatFileSize } from "@/utils/formatFileSize"
import type { StatementFile } from "@/features/file-upload/types/statementFile"

describe("formatFileSize", () => {
	test("should format large file sizes correctly", () => {
		// Create a mock file with 10.75MB
		const mockFile : StatementFile = {
			size: 10.75 * 1024 * 1024, // 10.75MB in bytes
			name: "large-file.xlsx",
			id: "06f74755-155b-4cd7-99c2-9a42f5cc8195", //create a random uuid
		}

		const result = formatFileSize(mockFile)
		expect(result).toBe("10.75 MB")
	})

	test("should format file size with zero bytes", () => {
		// Create a mock file with 0 bytes
		const mockFile : StatementFile = {
			size: 0,
			name: "large-file.xlsx",
			id: "06f74755-155b-4cd7-99c2-9a42f5cc8195", //create a random uuid
		}

		const result = formatFileSize(mockFile)
		expect(result).toBe("0.00 KB")
	})

	test("should maintain consistent decimal places", () => {
		// Test that all results have exactly 2 decimal places
		const testCases = [
			{ size: 1024, expected: "1.00 KB" }, // 1KB
			{ size: 1024 * 1024, expected: "1.00 MB" }, // 1MB
			{ size: 1536, expected: "1.50 KB" }, // 1.5KB
			{ size: 1.5 * 1024 * 1024, expected: "1.50 MB" }, // 1.5MB
			{ size: 2.5 * 1024 * 1024, expected: "2.50 MB" }, // 2.5MB
			{ size: 0.99 * 1024 * 1024, expected: "1013.76 KB" }, // 0.99MB in bytes
			{ size: 256.5 * 1024, expected: "256.50 KB" }, // 256KB
			{ size: 512 * 1024, expected: "512.00 KB" }, // 512KB
			{ size: 512, expected: "0.50 KB" }, // 0.50 KB
		]

		for (const { size, expected } of testCases) {

			const mockFile : StatementFile = {
				size: size,
				name: "large-file.xlsx",
				id: "06f74755-155b-4cd7-99c2-9a42f5cc8195", //create a random uuid
			}


			const result = formatFileSize(mockFile)
			expect(result).toBe(expected)
		}
	})
})
