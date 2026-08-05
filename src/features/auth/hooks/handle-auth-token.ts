import { redirect } from "@tanstack/react-router"
import { useAuthStore } from "@/stores/auth.store.ts"
import { getHashParams } from "@/lib/get-hash-params.ts"
import { toast } from "sonner"

export function handleAuthToken(location: { href: string; hash: string }, redirectPath: string) {
	const token = useAuthStore.getState().token
	if (token) return

	if (location.hash) {
		const accessToken = getHashParams("access_token", location.hash)
		if (accessToken) {
			useAuthStore.getState().setAuthToken(accessToken)
			return
		}
	}

	toast.error("invalid user session")
	throw redirect({ to: redirectPath, search: { redirect: location.href } })
}
