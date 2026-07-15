export default function pickRandomName(names: readonly string[]): string {
    const index = Math.floor(Math.random() * names.length)
    return names[index] ?? names[0]
}