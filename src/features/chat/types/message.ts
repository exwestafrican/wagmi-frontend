export enum MessageDirection {
	INBOUND = "inbound",
	OUTBOUND = "outbound",
}

export interface Message {
	id: number
	content: string
	direction: MessageDirection
	createdAt: Date
}
