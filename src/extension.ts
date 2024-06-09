
import * as vscode from 'vscode';
import axios from 'axios';
import * as child_process from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    console.log('Activating extension');
    let disposable = vscode.commands.registerCommand('ai-powered-terminal.start', () => {
        console.log('Command ai-powered-terminal.start triggered');

        // 创建并显示一个新的终端
        const terminal = vscode.window.createTerminal('AI-Powered Terminal');
        terminal.show();
        console.log('Terminal created and shown');

        // 创建一个 Node.js 子进程来运行 bash
        const proc = child_process.spawn('bash');
        console.log('Child process spawned');

        // 监听子进程的输出
        proc.stdout.on('data', async (data) => {
            const output = data.toString();
            console.log(`Captured output: ${output}`);

            // 调用 ChatGPT API 进行处理
            const summary = await getSummary(output);
            console.log(`Summary: ${summary}`);

            // 在终端中显示处理后的输出
            writeEmitter.fire(output);
            writeEmitter.fire(`\x1b[32mSummary: ${summary}\x1b[0m\r\n`);
        });

        proc.stderr.on('data', (data) => {
            console.error(`Error output: ${data.toString()}`);
        });

        proc.on('exit', (code) => {
            console.log(`Child process exited with code ${code}`);
        });

        // 事件发射器，用于向终端发送数据
        const writeEmitter = new vscode.EventEmitter<string>();
        const pty = {
            onDidWrite: writeEmitter.event,
            open: () => {
                writeEmitter.fire('AI-Powered Terminal started.\r\n');
                // 发送初始命令以确保子进程有输出
                proc.stdin.write('echo Hello World\n');
            },
            close: () => { },
            handleInput: (data: string) => {
                proc.stdin.write(data);
            }
        };

        // 创建一个伪终端
        const aiTerminal = vscode.window.createTerminal({ name: 'AI-Powered Terminal', pty });
        aiTerminal.show();
        console.log('AI-Powered Terminal with PseudoTerminal created and shown');
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
