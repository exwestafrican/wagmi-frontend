import { redirect } from "@tanstack/react-router"
import { useAuthStore } from "@common/stores/auth.store.ts"
import { getHashParams } from "@common/lib/get-hash-params.ts"
import { toast } from "sonner"

export function handleAuthToken(
	location: { href: string; hash: string },
	redirectPath: string,
) {
	if (useAuthStore.getState().token) return

	const accessToken = getHashParams("access_token", location.hash)
	if (accessToken) {
		useAuthStore.getState().setAuthToken(accessToken)
		return
	}

	toast.error("invalid user session")
	throw redirect({ to: redirectPath, search: { redirect: location.href } })
}
