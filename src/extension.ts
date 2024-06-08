import * as vscode from 'vscode';
import * as child_process from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('ai-powered-terminal.start', () => {
        const terminal = vscode.window.createTerminal('AI-Powered Terminal');
        terminal.show();

        // 创建一个Node.js子进程来运行命令
        const proc = child_process.spawn('bash');

        // 监听子进程的输出
        proc.stdout.on('data', (data) => {
            const output = data.toString();
            console.log(`Captured output: ${output}`);
            // 在这里调用ChatGPT API进行分析和提炼
        });

        // 将子进程的输出显示在VS Code终端中
        const writeEmitter = new vscode.EventEmitter<string>();
        const pty = {
            onDidWrite: writeEmitter.event,
            open: () => {
                writeEmitter.fire('AI-Powered Terminal started.\r\n');
            },
            close: () => {},
            handleInput: (data: string) => {
                proc.stdin.write(data);
            }
        };

        const aiTerminal = vscode.window.createTerminal({ name: 'AI-Powered Terminal', pty });
        aiTerminal.show();
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
