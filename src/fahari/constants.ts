export const FAHARI_WORKSPACE_CODE = ""

// Map ID from Google Cloud Map Management (same project as the Maps API key); falls back to Google's demo ID locally.
export const GOOGLE_MAPS_MAP_ID = import.meta.env.VITE_GOOGLE_MAPS_MAP_ID || "DEMO_MAP_ID"

export const FahariPages = {
	BOOKING: "/booking",
	BOOKING_SUCCESS: "/booking/success",
} as const

export const FahariApiPaths = {
	CHAUFFEUR_CLIENT: "booking/chauffeur-client",
	RIDE_FARE: "booking/calculate/ride-fare",
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
