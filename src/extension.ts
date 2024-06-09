import * as vscode from 'vscode';
import axios from 'axios';
import * as child_process from 'child_process';



// export function activate(context: vscode.ExtensionContext) {
// // console.log('Activating extension');
// let disposable = vscode.commands.registerCommand('ai-powered-terminal.start', () => {
// // console.log('Command ai-powered-terminal.start triggered');

// // 事件发射器，用于向终端发送数据
// const writeEmitter = new vscode.EventEmitter<string>();
// let userInput = '';

// const pty: vscode.Pseudoterminal = {
// onDidWrite: writeEmitter.event,
// open: () => {
// writeEmitter.fire('AI-Powered Terminal started.\r\n');
// },
// close: () => { },
// // handleInput: (data: string) => {
// // if (data === '\r') { // Enter key pressed
// // console.log(`User input: ${userInput}`);
// // // 创建一个 Node.js 子进程来运行用户的默认shell
// // const proc = child_process.spawn(process.env.SHELL || 'bash', ['-c', userInput]);
// // userInput = ''; // 清空输入缓存

// // proc.stdout.on('data', async (outputData) => {
// // const output = outputData.toString();
// // console.log(`Captured output: ${output}`);

// // // 调用 ChatGPT API 进行处理
// // const summary = await getSummary(output);
// // console.log(`Summary: ${summary}`);

// // // 在终端中显示处理后的输出
// // writeEmitter.fire(output);
// // writeEmitter.fire(`\x1b[32mSummary: ${summary}\x1b[0m\r\n`);
// // });

// // proc.stderr.on('data', (outputData) => {
// // console.error(`Error output: ${outputData.toString()}`);
// // writeEmitter.fire(`\x1b[31mError: ${outputData.toString()}\x1b[0m\r\n`);
// // });

// // proc.on('exit', (code) => {
// // console.log(`Child process exited with code ${code}`);
// // writeEmitter.fire(`\x1b[31mChild process exited with code ${code}\x1b[0m\r\n`);
// // });
// // } else if (data === '\x7f') { // Backspace key pressed
// // userInput = userInput.slice(0, -1);
// // } else {
// // userInput += data; // 将用户输入缓存
// // }
// // }
// handleInput: (data: string) => {
// console.log(`User input: ${data}`);
// // 创建一个 Node.js 子进程来运行用户的默认shell
// const proc = child_process.spawn(process.env.SHELL || 'bash', ['-c', data]);
// console.log('Child process spawned');

// // 监听子进程的输出
// proc.stdout.on('data', async (outputData) => {
// const output = outputData.toString();
// console.log(`Captured output: ${output}`);

// // 调用 ChatGPT API 进行处理
// const summary = await getSummary(output);
// console.log(`Summary: ${summary}`);

// // 在终端中显示处理后的输出
// writeEmitter.fire(output);
// writeEmitter.fire(`\x1b[32mSummary: ${summary}\x1b[0m\r\n`);
// });

// proc.stderr.on('data', (outputData) => {
// console.error(`Error output: ${outputData.toString()}`);
// writeEmitter.fire(`\x1b[31mError: ${outputData.toString()}\x1b[0m\r\n`);
// });

// proc.on('exit', (code) => {
// console.log(`Child process exited with code ${code}`);
// writeEmitter.fire(`\x1b[31mChild process exited with code ${code}\x1b[0m\r\n`);
// });
// }
// };

// // 创建一个伪终端
// const aiTerminal = vscode.window.createTerminal({ name: 'AI-Powered Terminal', pty });
// aiTerminal.show();
// // console.log('AI-Powered Terminal created and shown');
// });

// context.subscriptions.push(disposable);
// console.log('Extension activated and command registered');
// }


export function activate(context: vscode.ExtensionContext) {
    console.log('Activating extension');
    let disposable = vscode.commands.registerCommand('ai-powered-terminal.start', () => {
        console.log('Command ai-powered-terminal.start triggered');

        // 事件发射器，用于向终端发送数据
        const writeEmitter = new vscode.EventEmitter<string>();
        let userInput = '';

        const pty: vscode.Pseudoterminal = {
            onDidWrite: writeEmitter.event,
            open: () => {
                writeEmitter.fire('AI-Powered Terminal started.\r\n');
            },
            close: () => { },
            handleInput: (data: string) => {
                if (data === '\r') { // Enter key pressed
                    console.log(`User input: ${userInput}`);
                    // 创建一个 Node.js 子进程来运行用户的默认shell
                    const proc = child_process.spawn(process.env.SHELL || 'bash', ['-c', userInput]);
                    userInput = ''; // 清空输入缓存

                    proc.stdout.on('data', async (outputData) => {
                        const output = outputData.toString();
                        console.log(`Captured output: ${output}`);

                        // 调用 ChatGPT API 进行处理
                        const summary = await getSummary(output);
                        console.log(`Summary: ${summary}`);

                        // 在终端中显示处理后的输出
                        writeEmitter.fire(output);
                        writeEmitter.fire(`\x1b[32mSummary: ${summary}\x1b[0m\r\n`);
                    });

                    proc.stderr.on('data', (outputData) => {
                        console.error(`Error output: ${outputData.toString()}`);
                        writeEmitter.fire(`\x1b[31mError: ${outputData.toString()}\x1b[0m\r\n`);
                    });

                    proc.on('exit', (code) => {
                        console.log(`Child process exited with code ${code}`);
                        writeEmitter.fire(`\x1b[31mChild process exited with code ${code}\x1b[0m\r\n`);
                    });
                } else if (data === '\x7f') { // Backspace key pressed
                    if (userInput.length > 0) {
                        userInput = userInput.slice(0, -1);
                        writeEmitter.fire('\b \b'); // 在终端中删除最后一个字符
                    }
                } else {
                    userInput += data; // 将用户输入缓存
                    writeEmitter.fire(data); // 在终端中显示输入字符
                }
            }
        };

        // 创建一个伪终端
        const aiTerminal = vscode.window.createTerminal({ name: 'AI-Powered Terminal', pty });
        aiTerminal.show();
        console.log('AI-Powered Terminal created and shown');
    });

    context.subscriptions.push(disposable);
    console.log('Extension activated and command registered');
}


async function getSummary(content: string): Promise<string> {
    const apiKey = ''; // 确保这里是你有效的 API Key
    const apiUrl = 'https://api.openai.com/v1/chat/completions'; // 确认 URL 是否正确

    console.log('Sending request to:', apiUrl);
    console.log('Using API Key:', apiKey);
    console.log('Request prompt:', content);

    try {
        const response = await axios.post(apiUrl, {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: content }],
            max_tokens: 50
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('API Response:', response.data);
        return response.data.choices[0].message.content.trim();
    } catch (error: any) {
        console.error('Error fetching summary:', error);
        if (error.response) {
            console.log('Error response data:', error.response.data);
            console.log('Error response status:', error.response.status);
            console.log('Error response headers:', error.response.headers);
        } else if (error.request) {
            console.log('No response received:', error.request);
        } else {
            console.log('Request setup error:', error.message);
        }
        return 'Error fetching summary';
    }
}

export function deactivate() {
    console.log('Extension deactivated');
}