import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

export async function askInput(
    message:string,
    option?:{
        defaultName:string
    }
):Promise<string>{

    const rl = readline.createInterface({ input, output });
    let answer = "";
    try {
        answer = await rl.question(message);

    } finally {
        rl.close();
        return answer ?? option?.defaultName;
    }
}
