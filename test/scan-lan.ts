import { checkInternet } from "./service/check-internet";
import { scanHost } from "./service/scan-host";
import { scanPingIp } from "./service/scan-ping-ip";
import { scanPorts } from "./service/scan-ports";
import { scanPortsRange } from "./service/scan-ports-range";
import { getIp } from "./util/get-ip";

// const internetData = await checkInternet();
// console.table(internetData);

const getIpAddres = getIp();
console.table(getIpAddres);

// const getIpData = await getIp();
// console.table(getIpData);

// const scanHostData = await scanHost(getIpData[0].address,{
//     step:10,
//     portEnd:255
// });
// console.table(scanHostData);


// const scanPingData = await scanPingIp({
//     step:100,
//     end:200
// });
// console.table(scanPingData);

// const activeIps = scanPingData.filter((table)=>table.ok);
// console.table(activeIps);


// const scanPortsRangeData = await scanPortsRange();
// console.table(scanPortsRangeData);

// const scanPortList = [20,21,22,24,53,67,68,80,110,123,143,443,445,3306,5432,6379,8080,3000,5173,5500,8000,2222,27017];
// const scanPortEnd = activeIps.map((table) => scanPorts(table.ip,scanPortList));

// console.table(await scanPorts("192.168.0.9",scanPortList));

// const end:any[] = [];
// (await Promise.all(scanPortEnd)).forEach((table)=>{
//     table.forEach((recode)=>{
//         end.push(recode);
//     })
// })

// const activeEnd = end.filter((table)=>table.ok);
// console.table(activeEnd);

// const scanPortsData = await scanPorts(,scanPortList);
// console.table(scanPortsData);
