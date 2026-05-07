import { Server } from "./app/server.js";

type RequestNameList = "GET:/test" | "GET:/test/a" | "GET:/a";

const server = new Server<RequestNameList>(import.meta.url,"main",3000);
server.startServer();
server.onAPI("GET:/a",(data)=>{
    return data;
})