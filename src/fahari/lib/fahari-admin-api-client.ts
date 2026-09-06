import { createApiClient } from "@common/lib/create-api-client"
import { FahariAdminPages } from "@fahari/constants.ts"

export const fahariAdminApiClient = createApiClient(FahariAdminPages.LOGIN)
