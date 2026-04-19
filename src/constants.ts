export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost"

export const ApiPaths = {
	MAGIC_LINK_REQUEST: "/auth/magic-link/request",
	SIGNUP_EMAIL_ONLY: "/auth/signup/email-only",
	WORKSPACE: "/workspace",
	WORKSPACE_SETUP: "/workspace/setup",
	FEATURE_FLAGS_ENABLED: "/feature-flags/enabled",
	WAITLIST_JOIN: "/waitlist/join",
	ROADMAP_VOTE: "/roadmap/vote",
	ROADMAP_USER_VOTES: "/roadmap/user-votes",
	ROADMAP_FEATURE_REQUEST: "/roadmap/feature-request",
	ROADMAP_FUTURE_FEATURES: "/roadmap/future-features",
	INVITE_TEAMMATES: "/workspace/invite-teammates",
	CURRENT_TEAMMATE: "/teammates/me",
	VERIFY_INVITE: "/workspace/verify-invite",
	ACCEPT_INVITE: "workspace/accept-invite",
	CHECK_USERNAME: "/teammates/check-username",
} as const

export const ROLES = {
	WorkspaceAdmin: "WorkspaceAdmin",
	SupportStaff: "SupportStaff",
}

export const CHECK_MAIL_REASON = {
	LOGIN_SUCCESS: "login-success",
	SIGNUP_SUCCESS: "signup-success",
	INVITE_ACCEPTED_SUCCESS: "invite-accepted-success",
}
