export function isProcessMessage<ProcessMessage>(
    message: unknown,
    types: string[]
): message is ProcessMessage {
    if (!message || typeof message !== "object" || !("type" in message)) return false;
    if (typeof message.type !== "string") return false;

    return types.includes(message.type);
}
