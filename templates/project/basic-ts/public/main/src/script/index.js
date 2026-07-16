const apiResult = document.querySelector("#api-result");
const wsResult = document.querySelector("#ws-result");
const wsStatus = document.querySelector("#ws-status");

document.querySelector("#hello-button").addEventListener("click", async () => {
    apiResult.textContent = "Loading...";
    try {
        const response = await fetch("/api/hello?from=browser");
        apiResult.textContent = JSON.stringify(await response.json(), null, 2);
    } catch (error) {
        apiResult.textContent = String(error);
    }
});

const protocol = location.protocol === "https:" ? "wss" : "ws";
const socket = new WebSocket(`${protocol}://${location.host}/ws`);
socket.addEventListener("open", () => (wsStatus.textContent = "Connected"));
socket.addEventListener("close", () => (wsStatus.textContent = "Disconnected"));
socket.addEventListener("message", ({ data }) => (wsResult.textContent = String(data)));

document.querySelector("#ws-form").addEventListener("submit", (event) => {
    event.preventDefault();
    socket.send(document.querySelector("#ws-message").value);
});
