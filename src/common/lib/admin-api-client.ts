import { createApiClient } from "@common/lib/create-api-client"
import { AdminPages } from "@common/utils/pages"

export const adminApiClient = createApiClient(AdminPages.LOGIN)
