import readline from "node:readline/promises";
import rend from "readline";
import { stdin as input, stdout as output } from "node:process";

export async function askInput(message: string): Promise<string | null> {
    const rl = readline.createInterface({ input, output });

    try {
        const answer = await rl.question(message);

        rend.moveCursor(process.stdout, 0, -1);
        rend.clearLine(process.stdout, 0);

        if (answer.length === 0) {
            return null;
        }

        return answer;
    } finally {
        rl.close();
    }
}
