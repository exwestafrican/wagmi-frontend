import { createApiClient } from "@/lib/create-api-client"
import { Pages } from "@/utils/pages"

export const apiClient = createApiClient(Pages.LOGIN)
