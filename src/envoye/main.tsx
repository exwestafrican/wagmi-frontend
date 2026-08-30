import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import LanguageProvider from "@common/i18n/LanguageProvider.tsx"
import { createEnvoyeRouter } from "@envoye/app.tsx"

import "../styles.css"
import reportWebVitals from "../reportWebVitals.ts"

const queryClient = new QueryClient({})
const router = createEnvoyeRouter(queryClient)

const rootElement = document.getElementById("app")
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement)
	root.render(
		<StrictMode>
			<LanguageProvider>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} context={{ queryClient }} />
				</QueryClientProvider>
			</LanguageProvider>
		</StrictMode>,
	)
}

reportWebVitals()
