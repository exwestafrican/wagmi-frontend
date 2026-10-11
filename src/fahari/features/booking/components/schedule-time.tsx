export function ScheduleTime({
	label,
	detail,
}: {
	label: string
	detail: string
}) {
	return (
		<div className="flex flex-[1_0_0] flex-col items-start self-stretch">
			<p className="text-[9px] font-semibold uppercase leading-tight text-[#F7F9E4]">
				{label}
			</p>
			<p className="text-xs font-semibold leading-tight text-[#F7F9E4]">
				{detail}
			</p>
		</div>
	)
}
