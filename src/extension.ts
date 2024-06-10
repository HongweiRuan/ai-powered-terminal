import * as vscode from 'vscode';
import axios from 'axios';
import * as child_process from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating extension');
    let disposable = vscode.commands.registerCommand('ai-powered-terminal.start', () => {
        console.log('Command ai-powered-terminal.start triggered');

        const writeEmitter = new vscode.EventEmitter<string>();
        let userInput = '';
        const separator = '----------------------------\r\n';
        const blueSeprator = '\x1b[34m------------------------------------------------------------\x1b[0m\r\n';
        const redSeprator = '\x1b[31m------------------------------------------------------------\x1b[0m\r\n';
        // const uid = typeof process.getuid === 'function' ? process.getuid() : undefined;
        // const gid = typeof process.getgid === 'function' ? process.getgid() : undefined;

        // 获取用户的 shell 配置文件路径
        const shellConfig = process.env.SHELL || 'bash';
        const shellConfigArgs = ['--login'];

        let shell = child_process.spawn(shellConfig, shellConfigArgs, {
            env: process.env,
            // uid,
            // gid,
        });

        const pty: vscode.Pseudoterminal = {
            onDidWrite: writeEmitter.event,
            open: () => {
                writeEmitter.fire('AI-Powered Terminal started.\r\n');
                writeEmitter.fire(separator);
                shell.stdout.on('data', async (data) => {
                    const output = data.toString().replace(/\n/g, '\r\n');
                    writeEmitter.fire(output);
                    writeEmitter.fire(blueSeprator);  
                    // 调用 ChatGPT API 进行处理
                    if (data.length > 200) {
                        const summary = await getSummary(output);
                        writeEmitter.fire(`\x1b[32mSummary: ${summary}\x1b[0m\r\n`);
                        writeEmitter.fire(blueSeprator);
                    }
                });
                shell.stderr.on('data', (data) => {
                    const output = data.toString().replace(/\n/g, '\r\n');
                    writeEmitter.fire(`\x1b[31m${output}\x1b[0m`);
                });
                shell.on('exit', (code) => writeEmitter.fire(`\x1b[31mChild process exited with code ${code}\x1b[0m\r\n`));
            },
            close: () => { if (shell) shell.kill(); },
            handleInput: (data: string) => {

               

                if (data === '\r') {
                    shell.stdin.write(`${userInput}\n`);
                    writeEmitter.fire(`\r\n`);  // 在伪终端中添加新行
                    writeEmitter.fire(redSeprator);  // 在伪终端中添加分隔符
                    writeEmitter.fire(`\r\n`);  // 在伪终端中添加新行
                    userInput = '';
                } else if (data === '\x7f') {
                    if (userInput.length > 0) {
                        userInput = userInput.slice(0, -1);
                        writeEmitter.fire('\b \b');  // 在伪终端中处理退格
                    }
                } else {
                    userInput += data;
                    writeEmitter.fire(data);
                }
            }
        };

        const aiTerminal = vscode.window.createTerminal({ name: 'AI-Powered Terminal', pty });
        aiTerminal.show();
        // console.log('AI-Powered Terminal created and shown');
    });

    context.subscriptions.push(disposable);
    // console.log('Extension activated and command registered');
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
        return response.data.choices[0].message.content.trim().replace(/\n/g, '\r\n');
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