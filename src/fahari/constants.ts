export const FAHARI_WORKSPACE_CODE = ""

export const FahariPages = {
	BOOKING: "/booking",
	BOOKING_SUCCESS: "/booking/success",
} as const

export const FahariApiPaths = {
	BOOKING: "booking",
	CALCULATE: "booking/calculate",
	RIDE_REQUESTS: "booking/ride-requests",
} as const

export const FahariAdminPages = {
	LOGIN: "/admin",
	CHECK_EMAIL: "/admin/check-email",
	ACCOUNTS: "/admin/accounts",
	BOOKINGS: "/admin/bookings",
} as const

export const FahariAdminApiPaths = {
	LOGIN: "fahari/auth/admin/login",
	VERIFY_OTP: "fahari/auth/verify-otp",
	ME: "fahari/auth/me",
	USERS: "fahari/admin/users",
	RESERVED_ACCOUNT: "fahari/admin/users/reserved-account",
	PROVISION_RESERVED_ACCOUNT: "fahari/admin/users/provision-reserved-account",
} as const
