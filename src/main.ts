import { Server } from "./app/server.js";
import morgan from "morgan";

type RequestNameList = "GET:/test" | "GET:/test/a" | "GET:/a";

const server = new Server<RequestNameList>(import.meta.url,"main",3000,[
        morgan("dev")
    ]);
server.startServer();
server.onAPI("GET:/a",(data)=>{
    return data;
})