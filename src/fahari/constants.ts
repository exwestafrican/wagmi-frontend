export const FAHARI_WORKSPACE_CODE = ""

export const FahariAdminPages = {
	LOGIN: "/fahari/admin",
	CHECK_EMAIL: "/fahari/admin/check-email",
	BOOKINGS: "/fahari/admin/bookings",
} as const

export const FahariAdminApiPaths = {
	LOGIN: "fahari/auth/admin/login",
	VERIFY_OTP: "fahari/auth/verify-otp",
} as const
