import { createApiClient } from "@/lib/create-api-client"
import { AdminPages } from "@/utils/pages"

export const adminApiClient = createApiClient(AdminPages.LOGIN)
