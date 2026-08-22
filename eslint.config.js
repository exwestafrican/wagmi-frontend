import importPlugin from "eslint-plugin-import"
import tseslint from "typescript-eslint"

export default tseslint.config(
	{
		ignores: ["dist/**", "node_modules/**"],
	},
	{
		files: ["src/**/*.{ts,tsx}"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
		},
		plugins: {
			import: importPlugin,
		},
		rules: {
			"import/no-restricted-paths": [
				"error",
				{
					zones: [
						{
							target: "./src/envoye",
							from: "./src/fahari",
							message: "Envoye cannot import from Fahari",
						},
						{
							target: "./src/fahari",
							from: "./src/envoye",
							message: "Fahari cannot import from Envoye",
						},
						{
							target: "./src/common",
							from: "./src/envoye",
							message: "Common cannot import from Envoye",
						},
						{
							target: "./src/common",
							from: "./src/fahari",
							message: "Common cannot import from Fahari",
						},
					],
				},
			],
		},
	},
)
