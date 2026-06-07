import { useState } from "react"

const PLACEHOLDER_NAMES = [
	"Ahmed Ololade",
	"Sabrina Carpenter",
	"Damini Ogulu",
	"Taylor Swift",
	"Ayodeji Balogun",
	"Billie Eilish",
	"Abel Tesfaye",
	"Divine Ikubor",
	"Ariana Grande",
	"Aubrey Graham",
	"Solana Rowe",
	"Benito Martínez",
	"Olivia Rodrigo",
	"Kendrick Lamar",
	"Amala Dlamini",
	"Tyler Okonma",
	"David Guetta",
	"Isis Gaston",
	"Jacques Webster",
	"Beyoncé Knowles",
] as const

function pickRandomName(names: readonly string[]): string {
	const index = Math.floor(Math.random() * names.length)
	return names[index] ?? names[0]
}

export default function usePlaceholderName(): string {
	const [name] = useState(() => pickRandomName(PLACEHOLDER_NAMES))
	return name
}
