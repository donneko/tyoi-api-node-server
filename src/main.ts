import { Server } from "./app/server.js";


const server = new Server(import.meta.url,"main",3000);
server.startServer();
server.onAPI("GET:/a",(data)=>{
    return data;
})