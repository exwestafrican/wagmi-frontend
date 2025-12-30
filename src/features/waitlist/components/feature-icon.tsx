import {
	Mail,
	Image,
	Instagram,
	type LucideIcon,
	MessageCircle,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
	mail: Mail,
	image: Image,
	"message-square": Instagram,
	"message-circle": MessageCircle,
}

export function FeatureIcon({
	icon,
	className,
}: { icon: string; className?: string | undefined }) {
	const IconComponent = iconMap[icon]

	if (!IconComponent) {
		throw new Error(`Invalid icon: ${icon}`)
	}

	return <IconComponent className={className} strokeWidth={1.75} />
}
