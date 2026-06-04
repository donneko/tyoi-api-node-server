import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

const port = new SerialPort({
    path: "/dev/tty.usbmodem1101", // MacのArduinoポート
    baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

export function getSerial(){
    return {
        parser,
        port
    }
}
