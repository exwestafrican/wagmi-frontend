import { useWorkspaceEnabledFeatures } from "../api/feature-flags"

export function useEnabledFeature(workspaceCode: string, key: string) {
	const { data, isLoading } = useWorkspaceEnabledFeatures(workspaceCode)
	const enabled = (data?.data ?? []).includes(key)
	return { isEnabled: enabled, isLoading }
}
