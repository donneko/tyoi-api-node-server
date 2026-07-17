const status = document.querySelector("#status");
const messages = document.querySelector("#messages");
const form = document.querySelector("#message-form");
const input = document.querySelector("#message");
const button = form?.querySelector("button");

if (
    !(status instanceof HTMLElement) ||
    !(messages instanceof HTMLOListElement) ||
    !(form instanceof HTMLFormElement) ||
    !(input instanceof HTMLInputElement) ||
    !(button instanceof HTMLButtonElement)
) {
    throw new Error("Chat UI is incomplete");
}

const protocol = location.protocol === "https:" ? "wss" : "ws";
const socket = new WebSocket(`${protocol}://${location.host}/ws`);

const setStatus = (text, state) => {
    status.textContent = text;
    status.dataset.state = state;
};

socket.addEventListener("open", () => {
    setStatus("Connected", "open");
    button.disabled = false;
    input.focus();
});

socket.addEventListener("close", () => {
    setStatus("Disconnected", "closed");
    button.disabled = true;
});

socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(String(data));
    const item = document.createElement("li");
    item.dataset.type = message.type;
    item.textContent = `${message.text} (${message.clients} online)`;
    messages.append(item);
    messages.scrollTop = messages.scrollHeight;
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text || socket.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify({ type: "message", text }));
    input.value = "";
});
