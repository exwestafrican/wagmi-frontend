export const FAHARI_WORKSPACE_CODE = ""

export const FahariAdminPages = {
	LOGIN: "/fahari/admin",
	CHECK_EMAIL: "/fahari/admin/check-email",
	ACCOUNTS: "/fahari/admin/accounts",
	BOOKINGS: "/fahari/admin/bookings",
} as const

export const FahariAdminApiPaths = {
	LOGIN: "fahari/auth/admin/login",
	VERIFY_OTP: "fahari/auth/verify-otp",
	RESERVED_ACCOUNT: "fahari/admin/users/reserved-account",
} as const
