import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table.tsx"
import { Switch } from "@/components/ui/switch.tsx"
import { cn } from "@/lib/utils.ts"
import NotFound from "@/features/not-found.tsx"
import { ENVOYE_WORKSPACE_CODE, Permissions } from "@/constants.ts"
import { usePermission } from "@/features/permission/api/permissions.ts"
import { Loading } from "@/common/components/loading.tsx"
import { useFakeProgress } from "@/hooks/use-fake-progress.ts"
import { useDevices } from "@/features/admin/features/devices/api/list-devices.ts"
import { useUpdateDeviceActive } from "@/features/admin/features/devices/api/update-device-active.ts"
import { CreateDeviceModal } from "@/features/admin/features/devices/components/create-device-modal.tsx"
import DeviceDetail from "@/features/admin/features/devices/components/device-detail.tsx"
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs.tsx"
import { toast } from "sonner"
import { useState } from "react"
import { Plus } from "lucide-react"
import type { Device } from "@/features/admin/features/devices/interface/device.ts"

export default function AdminDevicesPage() {
	const {
		data: permissions = [],
		isPending,
		isError,
	} = usePermission(ENVOYE_WORKSPACE_CODE)
	const progress = useFakeProgress(isPending)
	const { data: devices = [] } = useDevices()
	const { mutate: updateDeviceActive } = useUpdateDeviceActive()

	const [createModalOpen, setCreateModalOpen] = useState(false)
	const [selectedId, setSelectedId] = useState<string | undefined>()

	const selectedDevice: Device | undefined =
		devices.find((device) => device.id === selectedId) ?? devices[0]

	if (isPending) {
		return <Loading text="Loading..." progress={progress} />
	}

	if (isError || !permissions.includes(Permissions.MANAGE_DEVICES)) {
		return <NotFound />
	}

	return (
		<div className="p-8 flex justify-start flex-col">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="text-2xl font-semibold">Devices</h1>
				<button
					type="button"
					data-testid="create-device-button"
					onClick={() => setCreateModalOpen(true)}
					className="group rounded-full bg-muted p-1 cursor-pointer shadow-[0_0_8px_rgba(0,0,0,0.12)] transition-colors hover:bg-muted/90 dark:bg-muted/60 dark:shadow-[0_0_10px_rgba(255,255,255,0.06)]"
				>
					<Plus className="h-5 w-5 text-green-600 group-hover:text-green-700 dark:text-green-400 dark:group-hover:text-green-300" />
				</button>
				<CreateDeviceModal
					open={createModalOpen}
					onOpenChange={setCreateModalOpen}
				/>
			</div>
			<div className="flex md:flex-row gap-16 flex-col">
				<div className="md:w-3/5">
					<Table>
						<TableHeader>
							<TableRow>
								{["imei", "active"].map((header) => (
									<TableHead
										key={header}
										className="text-xs capitalize text-left"
									>
										{header}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{devices.map((device) => (
								<TableRow
									key={device.id}
									data-state={
										selectedDevice?.id === device.id ? "selected" : undefined
									}
									onClick={() => setSelectedId(device.id)}
									className="cursor-pointer"
								>
									<TableCell className="whitespace-normal break-words min-w-0 max-w-md text-xs">
										{device.imei}
									</TableCell>
									<TableCell>
										<Switch
											className={cn(
												"cursor-pointer",
												"data-[state=checked]:bg-green-600",
												"dark:data-[state=checked]:bg-green-500",
											)}
											checked={device.isActive}
											aria-label={`Toggle ${device.imei} active`}
											onClick={(e) => e.stopPropagation()}
											onCheckedChange={(checked) => {
												updateDeviceActive(
													{ id: device.id, isActive: checked },
													{
														onError: () => {
															toast.error("Could not update device")
														},
													},
												)
											}}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>
				<div className="md:w-2/5">
					<Tabs defaultValue="details">
						<TabsList variant="line">
							<TabsTrigger
								value="details"
								className="capitalize cursor-pointer mb-8"
							>
								details
							</TabsTrigger>
						</TabsList>
						{selectedDevice && (
							<TabsContent value="details">
								<DeviceDetail key={selectedDevice.id} device={selectedDevice} />
							</TabsContent>
						)}
					</Tabs>
				</div>
			</div>
		</div>
	)
}
