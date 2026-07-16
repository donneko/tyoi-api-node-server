import { tyoi, type LoggerCreateData } from "@donneko/tyoi-server";

const app = tyoi({ baseDirname: import.meta.dirname, publicDirname: "./public/main" });
const onLog = (log: LoggerCreateData | void) => log && console.log(log.type, log.message);

app.server.onEvent("server/*:log", onLog);
console.log(app.server.hasEvent("server/*:log"));
await app.start();
app.server.offEvent("server/*:log", onLog);
