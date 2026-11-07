import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@common/components/ui/form"
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@common/components/ui/input-group.tsx"
import { cn } from "@common/lib/utils"
import { GOOGLE_MAPS_MAP_ID } from "@fahari/constants.ts"
import type { RideFormValues } from "@fahari/features/booking/schema/trip.schema.ts"
import {
	APILoadingStatus,
	APIProvider,
	AdvancedMarker,
	Map as GoogleMap,
	useApiLoadingStatus,
	useMapsLibrary,
} from "@vis.gl/react-google-maps"
import { MapPin } from "lucide-react"
import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"

const MIN_SEARCH_LENGTH = 3
const SEARCH_DELAY_MS = 300
// Most pickups are in Lagos, so suggestions lean there without excluding the rest of Nigeria.
const LAGOS_BIAS = { center: { lat: 6.5244, lng: 3.3792 }, radius: 50_000 }

type Suggestion = {
	id: string
	text: string
	prediction: google.maps.places.PlacePrediction
}

// Google can be switched off on purpose (to cap spend) or fail to load. Either way the
// field falls back to plain typing, so guests can always submit a pickup address.
export function PickupAddressField() {
	const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
	if (!apiKey) {
		return <PickupAddressInput places={null} showMap={false} />
	}
	return (
		<APIProvider apiKey={apiKey} region="NG" language="en">
			<GooglePickupAddress />
		</APIProvider>
	)
}

function GooglePickupAddress() {
	const places = useMapsLibrary("places")
	const loaded = useApiLoadingStatus() === APILoadingStatus.LOADED
	return <PickupAddressInput places={loaded ? places : null} showMap={loaded} />
}

function PickupAddressInput({
	places,
	showMap,
}: {
	places: google.maps.PlacesLibrary | null
	showMap: boolean
}) {
	const form = useFormContext<RideFormValues>()
	const listId = useId()
	const sessionToken = useRef<
		google.maps.places.AutocompleteSessionToken | undefined
	>(undefined)
	const [query, setQuery] = useState("")
	const [suggestions, setSuggestions] = useState<Suggestion[]>([])
	const [open, setOpen] = useState(false)
	const [activeIndex, setActiveIndex] = useState(-1)
	const [searchFailed, setSearchFailed] = useState(false)
	const pickupPlace = form.watch("pickupPlace")
	const searchable = places !== null && !searchFailed
	const showSuggestions = searchable && open && suggestions.length > 0

	useEffect(() => {
		const input = query.trim()
		if (!places || searchFailed || input.length < MIN_SEARCH_LENGTH) {
			setSuggestions([])
			return
		}
		let cancelled = false
		const timer = setTimeout(async () => {
			sessionToken.current ??= new places.AutocompleteSessionToken()
			try {
				const response =
					await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
						input,
						sessionToken: sessionToken.current,
						includedRegionCodes: ["ng"],
						locationBias: LAGOS_BIAS,
					})
				if (cancelled) return
				setSuggestions(
					response.suggestions.flatMap(({ placePrediction }) =>
						placePrediction
							? [
									{
										id: placePrediction.placeId,
										text: placePrediction.text.text,
										prediction: placePrediction,
									},
								]
							: [],
					),
				)
				setActiveIndex(-1)
			} catch {
				if (!cancelled) setSearchFailed(true)
			}
		}, SEARCH_DELAY_MS)
		return () => {
			cancelled = true
			clearTimeout(timer)
		}
	}, [places, query, searchFailed])

	async function choose(suggestion: Suggestion) {
		form.setValue("pickupAddress", suggestion.text, {
			shouldValidate: true,
			shouldDirty: true,
		})
		setOpen(false)
		setSuggestions([])
		const place = suggestion.prediction.toPlace()
		// Fetching the place ends Google's billing session, so the next search starts a new one.
		sessionToken.current = undefined
		try {
			await place.fetchFields({ fields: ["location"] })
		} catch {
			return
		}
		const stillChosen = form.getValues("pickupAddress") === suggestion.text
		if (place.location && stillChosen) {
			form.setValue("pickupPlace", {
				placeId: place.id,
				latitude: place.location.lat(),
				longitude: place.location.lng(),
			})
		}
	}

	function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
		if (event.key === "ArrowDown" && suggestions.length > 0) {
			event.preventDefault()
			setOpen(true)
			setActiveIndex((index) => Math.min(index + 1, suggestions.length - 1))
		} else if (event.key === "ArrowUp" && showSuggestions) {
			event.preventDefault()
			setActiveIndex((index) => Math.max(index - 1, 0))
		} else if (event.key === "Enter" && showSuggestions && activeIndex >= 0) {
			event.preventDefault()
			void choose(suggestions[activeIndex])
		} else if (event.key === "Escape" && showSuggestions) {
			event.preventDefault()
			setOpen(false)
		}
	}

	return (
		<>
			<FormField
				control={form.control}
				name="pickupAddress"
				render={({ field }) => (
					<FormItem className="relative gap-1.5">
						<InputGroup className="h-auto items-stretch rounded-xl border-[#d7e1e8] bg-white shadow-none has-aria-invalid:border-red-400 has-aria-invalid:ring-0">
							<InputGroupAddon align="block-start" className="px-2 pt-2 pb-0">
								<FormLabel className="text-[9px] leading-none font-semibold uppercase tracking-[0.08em] text-slate-500">
									Pick me up from
								</FormLabel>
							</InputGroupAddon>
							<div className="flex w-full items-center gap-2 px-2 pb-2">
								<FormControl>
									<InputGroupInput
										autoComplete={searchable ? "off" : "street-address"}
										placeholder="Add pickup"
										className="h-auto px-0 text-xs font-medium text-[#012420] md:text-xs"
										{...(searchable && {
											role: "combobox",
											"aria-autocomplete": "list" as const,
											"aria-expanded": showSuggestions,
											"aria-controls": listId,
											"aria-activedescendant":
												showSuggestions && activeIndex >= 0
													? `${listId}-${activeIndex}`
													: undefined,
										})}
										{...field}
										onChange={(event) => {
											field.onChange(event)
											setQuery(event.target.value)
											setOpen(true)
											form.setValue("pickupPlace", undefined)
										}}
										onBlur={() => {
											field.onBlur()
											setOpen(false)
										}}
										onKeyDown={onKeyDown}
									/>
								</FormControl>
								<InputGroupAddon align="inline-end" className="p-0">
									<MapPin
										className="size-4 shrink-0 text-[#10241c]"
										aria-hidden
									/>
								</InputGroupAddon>
							</div>
						</InputGroup>
						{showSuggestions && (
							<div className="absolute top-full z-20 mt-1 w-full overflow-hidden rounded-xl border border-[#d7e1e8] bg-white shadow-md">
								{/* biome-ignore lint/a11y/useFocusableInteractive lint/a11y/useSemanticElements: combobox pattern; focus stays on the input via aria-activedescendant */}
								<div id={listId} role="listbox" aria-label="Pickup suggestions">
									{suggestions.map((suggestion, index) => (
										// biome-ignore lint/a11y/useFocusableInteractive lint/a11y/useSemanticElements lint/a11y/useKeyWithClickEvents: options are chosen with the input's arrow keys and Enter
										<div
											role="option"
											key={suggestion.id}
											id={`${listId}-${index}`}
											aria-selected={index === activeIndex}
											onMouseDown={(event) => event.preventDefault()}
											onClick={() => void choose(suggestion)}
											className={cn(
												"cursor-pointer px-3 py-2 text-xs text-[#012420]",
												index === activeIndex && "bg-slate-100",
											)}
										>
											{suggestion.text}
										</div>
									))}
								</div>
								<p className="border-t border-[#d7e1e8] px-3 py-1.5 text-right text-[10px] text-slate-500">
									Google Maps
								</p>
							</div>
						)}
						<FormMessage className="text-[11px]" />
					</FormItem>
				)}
			/>
			{showMap && pickupPlace && (
				<section
					aria-label="Pickup on the map"
					className="h-36 overflow-hidden rounded-xl border border-[#d7e1e8]"
				>
					<GoogleMap
						key={pickupPlace.placeId}
						mapId={GOOGLE_MAPS_MAP_ID}
						defaultCenter={{
							lat: pickupPlace.latitude,
							lng: pickupPlace.longitude,
						}}
						defaultZoom={16}
						disableDefaultUI
						gestureHandling="cooperative"
					>
						<AdvancedMarker
							position={{
								lat: pickupPlace.latitude,
								lng: pickupPlace.longitude,
							}}
						/>
					</GoogleMap>
				</section>
			)}
		</>
	)
}
