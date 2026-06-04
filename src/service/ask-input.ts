import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export async function askInput(
    message:string
):Promise<string | null>{

    const rl = readline.createInterface({ input, output });
    let answer;
    try {
        answer = await rl.question(message)
    } finally {
        rl.close();
        return (!answer || answer.length === 0)?
            null:
            answer
    }
}
