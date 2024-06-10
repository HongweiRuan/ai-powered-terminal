# AI-Powered Terminal

AI-Powered Terminal 是一个 VS Code 扩展，它增强了终端输出的可读性，并能自动生成命令的总结。该扩展使用 OpenAI 的 GPT-4 模型来生成总结。

## 功能

- 在终端中运行命令并生成输出
- 自动生成命令输出的总结
- 支持自定义颜色的分隔符

## 使用

1. 打开 VS Code。
2. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac) 打开命令面板。
3. 输入 `AI-Powered Terminal: Start` 并选择相应的命令来启动 AI-Powered Terminal。
4. 在终端中输入你的命令并按回车，AI 将自动生成输出总结并显示。

## 设置

首次使用时，扩展将提示你输入 OpenAI API Key。你可以在 VS Code 设置中更新此 API Key。

1. 首次输入 `AI-Powered Terminal: Start`后会提示输入您的API key
2. 输入你的 OpenAI API Key。

## 开发

如果你想参与开发或对代码进行修改，请遵循以下步骤：

1. 克隆此仓库到本地：

    ```sh
    git clone https://github.com/HongweiRuan/ai-powered-terminal.git
    ```

2. 安装依赖：

    ```sh
    npm install
    ```

3. 进行你想要的修改。
4. 打包扩展：

    ```sh
    vsce package
    ```

5. 在 VS Code 中安装打包的 `.vsix` 文件。

## 许可证

此项目遵循 MIT 许可证。详细信息请参阅 [LICENSE](LICENSE) 文件。

## 贡献

欢迎提交问题和拉取请求。请确保您的代码符合项目的编码规范，并附上详细的提交信息。

## 联系方式

如有任何问题或建议，请通过 [hongwei.ruan02@gmail] 联系我们。

