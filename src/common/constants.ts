export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost"

export const CHECK_MAIL_REASON = {
	LOGIN_SUCCESS: "login-success",
	ADMIN_LOGIN_SUCCESS: "admin-login-success",
	SIGNUP_SUCCESS: "signup-success",
	INVITE_ACCEPTED_SUCCESS: "invite-accepted-success",
}

export const DESKTOP_KEYS = {
	ENTER: "Enter",
	ESCAPE: "Escape",
}

export const TEST_DESKTOP_KEYS = {
	ENTER: "{Enter}",
	ESCAPE: "{Escape}",
	CMD_ENTER: "{Meta>}{Enter}{/Meta}",
}
