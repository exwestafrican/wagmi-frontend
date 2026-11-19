import {
	EventCard,
	EventRowCard,
	LastChanceCard,
	MyEventCard,
	SimilarEventCard,
} from "@fahari/components/cards/event-cards.tsx"
import { Avatar, AvatarGroup } from "@fahari/components/ui/avatar.tsx"
import {
	Button,
	IconButton,
	InterestedButton,
	SplitPill,
	SplitPillButton,
	ThemeToggle,
} from "@fahari/components/ui/button.tsx"
import {
	Checkbox,
	Segmented,
	Stepper,
	Switch,
	UploadBox,
} from "@fahari/components/ui/controls.tsx"
import {
	DateField,
	PhoneField,
	PriceField,
	TextField,
	TextareaField,
	TimeField,
} from "@fahari/components/ui/field.tsx"
import {
	BottomSheet,
	BottomSheetClose,
	BottomSheetContent,
	BottomSheetDescription,
	BottomSheetTitle,
	BottomSheetTrigger,
	Modal,
	ModalClose,
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalTitle,
	ModalTrigger,
	Toast,
	showToast,
} from "@fahari/components/ui/overlay.tsx"
import {
	ActivityItem,
	EmptyState,
	ErrorBlock,
	Faq,
	SkeletonCard,
	SkeletonRow,
} from "@fahari/components/ui/patterns.tsx"
import {
	CountdownSticker,
	Pill,
	SoldOutBadge,
	SourcePill,
} from "@fahari/components/ui/pill.tsx"
import { FahariTheme } from "@fahari/theme/fahari-theme.tsx"
import { CalendarPlus, Share2, Star, Ticket, Users } from "lucide-react"
import { type ReactNode, useState } from "react"

const people = [
	"Naomi Ade",
	"Karneisa A",
	"Tolu O",
	"Ada D",
	"Femi E",
	...Array.from({ length: 14 }, (_, index) => `Guest ${index + 1}`),
].map((name) => ({ name }))

const swatches = [
	["bg-fh-page", "page"],
	["bg-fh-surface", "surface"],
	["bg-fh-subtle", "subtle"],
	["bg-fh-line", "line"],
	["bg-fh-line-strong", "line-strong"],
	["bg-fh-ink", "ink"],
	["bg-fh-ink-muted", "ink-muted"],
	["bg-fh-accent", "accent"],
	["bg-fh-accent-hover", "accent-hover"],
	["bg-fh-accent-pressed", "accent-pressed"],
	["bg-fh-accent-ink", "accent-ink"],
	["bg-fh-inverse", "inverse"],
	["bg-fh-error", "error"],
	["bg-fh-success", "success"],
	["bg-fh-placeholder", "placeholder"],
	["bg-fh-brand", "brand"],
	["bg-fh-midnight", "midnight"],
	["bg-fh-aqua", "aqua"],
	["bg-fh-ivory", "ivory"],
]

const typeScale = [
	["text-fh-display", "Display · 56 / 64 · Bold"],
	["text-fh-h1", "H1 · 40 / 48 · Bold"],
	["text-fh-h2", "H2 · 28 / 36 · Bold"],
	["text-fh-h3", "H3 · 20 / 28 · Semibold"],
	["text-fh-body", "Body · 16 / 24 · Regular"],
	["text-fh-body font-semibold", "Body bold · 16 / 24 · Semibold"],
	["text-fh-small", "Small · 14 / 20 · Regular"],
	["text-fh-caption", "Caption · 12 / 16 · Medium"],
]

function Section({ title, children }: { title: string; children: ReactNode }) {
	return (
		<section className="flex flex-col gap-6">
			<h2 className="text-fh-h2 text-fh-ink">{title}</h2>
			{children}
		</section>
	)
}

function Row({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-3">
			<p className="text-fh-caption tracking-wide text-fh-ink-muted uppercase">
				{label}
			</p>
			<div className="flex flex-wrap items-start gap-6">{children}</div>
		</div>
	)
}

function noop() {}

// Development-only page that shows every Fahari design system piece in one place,
// so it can be compared against the Pen file in light and dark mode.
export function DesignSystemPage() {
	const [count, setCount] = useState(1)
	const [ticketType, setTicketType] = useState<"free" | "paid">("free")
	const [date, setDate] = useState<Date>()
	const [notify, setNotify] = useState(true)
	const [starred, setStarred] = useState(false)
	const [time, setTime] = useState<string>()
	const [cover, setCover] = useState<File>()
	const [interestedA, setInterestedA] = useState(true)

	return (
		<FahariTheme>
			<main className="min-h-screen bg-fh-page text-fh-ink">
				<div className="mx-auto flex max-w-[1280px] flex-col gap-16 px-6 py-12">
					<header className="flex items-center justify-between gap-4">
						<h1 className="text-fh-h1">Fahari Design System</h1>
						<ThemeToggle />
					</header>

					<Section title="Colours">
						<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
							{swatches.map(([className, name]) => (
								<div key={name} className="flex flex-col gap-2">
									<div
										className={`h-16 rounded-fh-md border border-fh-line ${className}`}
									/>
									<span className="text-fh-caption text-fh-ink-muted">
										{name}
									</span>
								</div>
							))}
						</div>
					</Section>

					<Section title="Typography">
						<div className="flex flex-col gap-6">
							{typeScale.map(([className, spec]) => (
								<div key={spec} className="flex flex-col gap-1">
									<span className="text-fh-caption text-fh-ink-muted">
										{spec}
									</span>
									<p className={className}>
										Weekend escapes, planned end to end
									</p>
								</div>
							))}
							<div className="flex flex-col gap-1">
								<span className="text-fh-caption text-fh-ink-muted">
									Accent · script, 1 to 3 words per page
								</span>
								<p className="font-fahari-accent text-5xl">Let's go!</p>
							</div>
						</div>
					</Section>

					<Section title="Buttons">
						<Row label="Primary">
							<Button>Book a spot</Button>
							<Button disabled>Book a spot</Button>
							<Button loading>Book a spot</Button>
						</Row>
						<Row label="Secondary">
							<Button variant="secondary">Publish event</Button>
							<Button variant="secondary" disabled>
								Publish event
							</Button>
							<Button variant="secondary" loading>
								Publish event
							</Button>
						</Row>
						<Row label="Outline">
							<Button variant="outline">View all</Button>
							<Button variant="outline" disabled>
								View all
							</Button>
							<Button variant="outline" loading>
								View all
							</Button>
						</Row>
						<Row label="Text link">
							<Button variant="link">Get directions</Button>
							<Button variant="link" disabled>
								Get directions
							</Button>
						</Row>
						<Row label="Round icon">
							<IconButton aria-label="Share">
								<Share2 aria-hidden />
							</IconButton>
							<IconButton aria-label="Share" disabled>
								<Share2 aria-hidden />
							</IconButton>
							<IconButton aria-label="Share" loading>
								<Share2 aria-hidden />
							</IconButton>
							<IconButton aria-label="Share" variant="outline" size="xs">
								<Share2 aria-hidden />
							</IconButton>
							<IconButton aria-label="Share" variant="onPhoto" size="sm">
								<Share2 aria-hidden />
							</IconButton>
						</Row>
						<Row label="Interested">
							<InterestedButton
								interested={interestedA}
								onClick={() => setInterestedA((current) => !current)}
							/>
							<InterestedButton
								variant="outline"
								size="xs"
								interested={interestedA}
								onClick={() => setInterestedA((current) => !current)}
							/>
						</Row>
						<Row label="Split pill">
							<SplitPill className="w-[360px]">
								<SplitPillButton>🎟️ RSVP</SplitPillButton>
								<SplitPillButton>
									<Star aria-hidden />
									Interested
								</SplitPillButton>
							</SplitPill>
							<SplitPill disabled className="w-[360px]">
								<SplitPillButton>🎟️ RSVP</SplitPillButton>
								<SplitPillButton>
									<Star aria-hidden />
									Interested
								</SplitPillButton>
							</SplitPill>
						</Row>
						<Row label="Theme toggle">
							<ThemeToggle />
							<ThemeToggle onPhoto />
						</Row>
					</Section>

					<Section title="Inputs">
						<Row label="Text">
							<TextField
								className="w-[260px]"
								label="Event title"
								placeholder="e.g. Ilashe Beach Day"
								helper="Keep it short and clear."
							/>
							<TextField
								className="w-[260px]"
								label="Event title"
								defaultValue="Ilashe Beach Day"
								helper="Keep it short and clear."
							/>
							<TextField
								className="w-[260px]"
								label="Event title"
								placeholder="e.g. Ilashe Beach Day"
								helper="Keep it short and clear."
								disabled
							/>
							<TextField
								className="w-[260px]"
								label="Event title"
								defaultValue="Ilashe Beach Day"
								error="Add an event title"
							/>
						</Row>
						<Row label="Textarea">
							<TextareaField
								className="w-[260px]"
								label="Description"
								placeholder="What will guests do?"
								helper="Up to 500 characters."
							/>
							<TextareaField
								className="w-[260px]"
								label="Description"
								defaultValue="A slow Saturday by the sea with food and games."
								error="Add a description"
							/>
						</Row>
						<Row label="Date, time, phone, price">
							<DateField
								className="w-[260px]"
								label="Start date"
								value={date}
								onChange={setDate}
								disabledDays={{ before: new Date() }}
								pickerNote="Past days cannot be picked."
								helper="Rides can be booked 5 to 40 days ahead."
							/>
							<TimeField
								className="w-[260px]"
								label="Start time"
								value={time}
								onChange={setTime}
								isTimeDisabled={(option) =>
									option < "08:00" || option > "22:00"
								}
								helper="Local time (WAT)."
							/>
							<PhoneField
								className="w-[260px]"
								label="Phone"
								placeholder="803 000 0000"
								helper="We'll text your booking details."
							/>
							<PriceField
								className="w-[260px]"
								label="Ticket price"
								placeholder="40,000"
								helper="Per person."
							/>
						</Row>
						<Row label="Date, phone, price with errors">
							<DateField
								className="w-[260px]"
								label="Start date"
								value={new Date(2026, 10, 14)}
								onChange={noop}
								error="Pick a date in the future"
							/>
							<PhoneField
								className="w-[260px]"
								label="Phone"
								defaultValue="803 123 4567"
								error="Enter a valid phone number"
							/>
							<PriceField
								className="w-[260px]"
								label="Ticket price"
								defaultValue="40,000"
								error="Enter a price above ₦0"
							/>
						</Row>
						<Row label="Stepper, toggle, checkbox">
							<Stepper value={count} onChange={setCount} max={3} />
							<Switch
								checked={notify}
								onCheckedChange={setNotify}
								aria-label="Notifications"
							/>
							<Switch disabled aria-label="Notifications (disabled)" />
							<Checkbox>Unlimited</Checkbox>
							<Checkbox defaultChecked>Unlimited</Checkbox>
							<Checkbox disabled>Unlimited</Checkbox>
						</Row>
						<Row label="Segmented">
							<Segmented
								aria-label="Ticket type"
								className="w-[340px]"
								value={ticketType}
								onValueChange={setTicketType}
								options={[
									{
										value: "free",
										label: "Free (RSVP)",
										icon: <Users aria-hidden />,
									},
									{
										value: "paid",
										label: "Paid (tickets)",
										icon: <Ticket aria-hidden />,
									},
								]}
							/>
						</Row>
						<Row label="File upload">
							<UploadBox
								className="w-[300px]"
								hint="JPG, PNG or MP4, up to 20MB"
								accept="image/*,video/mp4"
								value={cover}
								onFiles={(files) => setCover(files[0])}
								onRemove={() => setCover(undefined)}
							/>
							<UploadBox
								className="w-[300px]"
								error="File is too large. Max 20MB."
								onFiles={noop}
							/>
						</Row>
					</Section>

					<Section title="Pills & stickers">
						<Row label="Status pills">
							<Pill>Active</Pill>
							<Pill variant="deactivated">Deactivated</Pill>
							<Pill variant="status">2 spots left</Pill>
							<Pill variant="ended">Ended</Pill>
						</Row>
						<Row label="Stickers">
							<CountdownSticker>⏳ Closes in 14h 32m</CountdownSticker>
							<SoldOutBadge />
						</Row>
						<Row label="Source pill">
							<SourcePill source="instagram" />
							<SourcePill source="fahari" />
						</Row>
					</Section>

					<Section title="Patterns">
						<Row label="Avatars">
							<Avatar name="Naomi Ade" />
							<AvatarGroup people={people} />
						</Row>
						<Row label="FAQ">
							<Faq
								className="w-[420px]"
								items={[
									{
										question: "What's the refund policy?",
										answer:
											"Full refund up to 48 hours before the event. After that, we can move your spot to a friend.",
									},
									{
										question: "Can I bring a friend?",
										answer: "Yes, as long as there are spots left.",
									},
								]}
							/>
						</Row>
						<Row label="Activity">
							<ActivityItem
								className="w-[380px]"
								name="Karneisa"
								meta="commented · 3d"
								comment="Can't wait for the plantain stop!"
								reactions={[{ emoji: "❤️", count: 6 }]}
								onReact={noop}
								onReply={noop}
							/>
							<ActivityItem
								className="w-[380px]"
								name="Naomi"
								meta="· 2d"
								update="updated their RSVP to Going 🎟️"
								reactions={[{ emoji: "🎉", count: 4 }]}
								onReact={noop}
								onReply={noop}
							/>
						</Row>
						<Row label="Modal, bottom sheet, toast">
							<Modal>
								<ModalTrigger asChild>
									<Button variant="outline">Open modal</Button>
								</ModalTrigger>
								<ModalContent>
									<ModalTitle>Close bookings for this event?</ModalTitle>
									<ModalDescription>
										Guests won't be able to book anymore. People who already
										booked keep their spots.
									</ModalDescription>
									<ModalFooter>
										<ModalClose asChild>
											<Button variant="outline">Cancel</Button>
										</ModalClose>
										<ModalClose asChild>
											<Button>Close bookings</Button>
										</ModalClose>
									</ModalFooter>
								</ModalContent>
							</Modal>
							<BottomSheet>
								<BottomSheetTrigger asChild>
									<Button variant="outline">Open bottom sheet</Button>
								</BottomSheetTrigger>
								<BottomSheetContent>
									<BottomSheetTitle>Close bookings?</BottomSheetTitle>
									<BottomSheetDescription>
										People who already booked keep their spots.
									</BottomSheetDescription>
									<BottomSheetClose asChild>
										<Button>Close bookings</Button>
									</BottomSheetClose>
									<BottomSheetClose asChild>
										<Button variant="outline">Cancel</Button>
									</BottomSheetClose>
								</BottomSheetContent>
							</BottomSheet>
							<Button
								variant="outline"
								onClick={() =>
									showToast.success(
										"Booking confirmed",
										"We've sent the details to your email.",
									)
								}
							>
								Show toast
							</Button>
						</Row>
						<Row label="Toast">
							<Toast
								status="success"
								title="Booking confirmed"
								body="We've sent the details to your email."
								onClose={noop}
							/>
							<Toast
								status="error"
								title="Payment failed"
								body="Your card wasn't charged. Please try again."
								onClose={noop}
							/>
						</Row>
						<Row label="Skeletons">
							<SkeletonCard className="w-[320px]" />
							<SkeletonRow className="w-[360px]" />
						</Row>
						<Row label="Empty & error">
							<EmptyState
								className="w-[420px]"
								icon={<CalendarPlus aria-hidden />}
								title="No events yet"
								body="Create your first event and share your link. Your bookings will show up here."
								action={<Button>Create event</Button>}
							/>
							<ErrorBlock
								className="w-[420px]"
								body="We couldn't load this page. Check your connection and try again."
								action={<Button variant="outline">Try again</Button>}
							/>
						</Row>
					</Section>

					<Section title="Cards">
						<Row label="Event">
							<EventCard
								className="w-[432px]"
								title="Food Tour Saturday"
								meta="Sat 14 Nov at 11:00 AM · Ikoyi, Lagos"
								hostName="Taste of Lagos"
								price="from ₦40,000"
								interested="48 interested"
								starred={starred}
								onStar={() => setStarred((current) => !current)}
								onShare={noop}
								onAddToCalendar={noop}
							/>
							<EventCard
								className="w-[432px]"
								title="Food Tour Saturday"
								meta="Sat 14 Nov at 11:00 AM · Ikoyi, Lagos"
								hostName="Taste of Lagos"
								price="from ₦40,000"
								interested="48 interested"
								countdown="⏳ Closes in 14h 32m"
								soldOut
								onStar={noop}
								onShare={noop}
								onAddToCalendar={noop}
							/>
						</Row>
						<Row label="Mobile row">
							<EventRowCard
								className="w-[358px]"
								title="Sunset Boat Cruise"
								meta="Sat 21 Nov, 5:30 PM · Lekki"
								price="from ₦35,000"
								interested="37 interested"
								onStar={noop}
								onShare={noop}
								onAddToCalendar={noop}
							/>
						</Row>
						<Row label="Last chance">
							<LastChanceCard
								className="w-[560px]"
								title="Food Tour Saturday"
								meta="Sat 14 Nov · 11:00 AM · Ikoyi"
								price="from ₦40,000"
								interested="48 interested"
								countdown="⏳ Closes in 14h 32m"
								onStar={noop}
							/>
						</Row>
						<Row label="More like this">
							<SimilarEventCard
								className="w-[380px]"
								title="Lakeside Picnic Day"
								meta="Sun 22 Nov at 12:00 PM · Jabi Lake"
								price="from ₦25,000"
								interested="22 interested"
								onStar={noop}
							/>
						</Row>
						<Row label="My events">
							<MyEventCard
								className="w-[760px]"
								title="Ilashe Beach Day"
								active
								date="Sat 28 Nov 2026"
								booked={12}
								capacity={20}
								collected="₦540,000 collected"
							/>
							<MyEventCard
								className="w-[760px]"
								title="Ilashe Beach Day"
								active={false}
								date="Sat 28 Nov 2026"
								booked={20}
								capacity={20}
								collected="₦900,000 collected"
							/>
						</Row>
					</Section>
				</div>
			</main>
		</FahariTheme>
	)
}
