const clock = document.querySelector("#clock");

if (!(clock instanceof HTMLElement)) {
    throw new Error("Clock element was not found");
}

const updateClock = () => {
    clock.textContent = `Server time: ${new Date().toLocaleTimeString("ja-JP")}`;
};

updateClock();
setInterval(updateClock, 1000);
