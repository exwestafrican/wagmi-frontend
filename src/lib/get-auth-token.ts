import { useAuthStore } from "@/stores/auth.store.ts"
import { getHashParams } from "@/lib/get-hash-params.ts"

export default function getAuthToken() {
	const storeToken = useAuthStore.getState().token
	if (storeToken == null) {
		return getHashParams("access_token")
	}
	return storeToken
}
