# Minimal VSCode 开发计划

## 概述

基于 `lite` 分支创建一个最简化版本的 VSCode (Code - OSS)，保留核心编辑功能，移除不必要的扩展和功能。

## 当前进度

### ✅ 已完成

1. **扩展目录精简** - 只保留 JS/JSON/TypeScript 相关扩展
2. **product.json 更新** - minimalBuiltInExtensionIds 已配置
3. **extensions/package.json 精简** - 移除不需要的依赖

### ⏸️ 保留的模块 (因深度集成)

以下模块因与 extension host API 深度集成，暂时保留：
- `notebook` - Notebook 渲染器
- `terminal` - 终端
- `chat` - Copilot Chat

### ⏸️ 待处理

以下模块待清理（需要修改 extension host 协议）：
- `git` - Git 集成
- `debug` - 调试功能
- `extensions` - 扩展管理
- `userDataSync` - 用户数据同步
- `mcp` - Model Context Protocol
- `mergeEditor` - 合并冲突编辑器
- `customEditor` - 自定义编辑器
- `webviewPanel` - Webview 面板
- `remote` / `remoteTunnel` - 远程开发
- `speech` - 语音识别
- `authentication` - 认证
- `inlineChat` - 内联聊天
- `interactive` - 交互式会话

## lite 分支与 main 分支差异

- `dc21e187598` - Enhance build process and update configurations
- `eb543a653a9` - remove eslint

## 核心模块 (必须保留)

### 1. 编辑器核心 (`src/vs/editor/`)
- 代码编辑器组件
- 语法高亮
- 文本编辑功能
- 语言服务接口

### 2. 工作台核心 (`src/vs/workbench/browser/`)
- 窗口管理
- 布局系统
- 菜单/命令系统
- 状态栏

### 3. 基础服务 (`src/vs/workbench/services/`)
- 文件服务
- 配置服务
- 窗口服务
- 生命周期服务

### 4. 基础设施 (`src/vs/platform/`)
- 依赖注入
- 日志服务
- 通知服务
- 快速输入服务

## 开发阶段

### Phase 1: 环境搭建 ✅
1. ✅ 配置最小化构建参数
2. ✅ 设置 `minimalBuiltInExtensionIds`
3. ✅ 验证基础编译流程

### Phase 2: 核心功能验证
1. 验证编辑器加载
2. 验证文件打开/保存
3. 验证窗口布局
4. 验证命令系统

### Phase 3: 精简模块
1. ⏸️ Chat/Copilot 相关模块 (深度集成)
2. ⏸️ Notebook (深度集成)
3. ⏸️ 远程开发相关模块
4. ⏸️ Terminal (深度集成)

### Phase 4: 功能裁剪
1. 精简扩展系统
2. 精简设置系统
3. 精简 UI 组件

## 配置清单

### product.json 关键配置 ✅
```json
{
  "minimalBuiltInExtensionIds": [
    "javascript",
    "json",
    "json-language-features",
    "typescript-basics",
    "typescript-language-features"
  ]
}
```

### extensions/package.json ✅
```json
{
  "name": "vscode-extensions",
  "version": "0.0.1",
  "license": "MIT",
  "description": "Dependencies shared by all extensions",
  "dependencies": {
    "typescript": "^5.9.3"
  },
  "scripts": {
    "postinstall": "node ./postinstall.mjs"
  },
  "devDependencies": {
    "esbuild": "0.27.2",
    "vscode-grammar-updater": "^1.1.0"
  }
}
```

## 构建验证

### 编译命令
```bash
npm run compile-check-ts-native  # 类型检查
VSCODE_MINIMAL_BUILD=1 npm run build  # 最小化构建
```

### 运行时验证
1. 启动应用 - 验证无报错
2. 打开文件 - 验证编辑器加载
3. 基本编辑 - 验证输入正常
4. 命令面板 - 验证命令执行

## 扩展目录结构

### 清理后保留的目录
```
extensions/
├── javascript/
├── json/
├── json-language-features/
├── typescript-basics/
├── typescript-language-features/
├── esbuild-extension-common.mts  (esbuild 所需)
├── esbuild-webview-common.mts    (esbuild 所需)
├── postinstall.mjs               (typescript 精简脚本)
├── package.json
├── package-lock.json
├── tsconfig.base.json
└── types/
```

### 删除的扩展 (约 90 个)
bat, clojure, coffeescript, configuration-editing, cpp, csharp, css, css-language-features, dart, debug-auto-launch, debug-server-ready, diff, docker, dotenv, emmet, extension-editing, fsharp, git, git-base, github, github-authentication, go, groovy, grunt, gulp, handlebars, hlsl, html, html-language-features, ini, ipynb, jake, java, julia, latex, less, log, lua, make, markdown-basics, markdown-language-features, markdown-math, media-preview, merge-conflict, mermaid-chat-features, microsoft-authentication, notebook-renderers, npm, objective-c, perl, php, php-language-features, powershell, prompt-basics, pug, python, r, razor, references-view, restructuredtext, ruby, rust, scss, search-result, shaderlab, shellscript, simple-browser, sql, swift, terminal-suggest, theme-*, tunnel-forwarding, vb, vscode-api-tests, vscode-colorize-*, vscode-test-resolver, xml, yaml

## 文件清理清单

### 需要删除的 workbench contrib 模块
```
src/vs/workbench/contrib/chat/           (深度集成)
src/vs/workbench/contrib/inlineChat/
src/vs/workbench/contrib/interactive/
src/vs/workbench/contrib/notebook/        (深度集成)
src/vs/workbench/contrib/remote/
src/vs/workbench/contrib/remoteTunnel/
src/vs/workbench/contrib/speech/
src/vs/workbench/contrib/authentication/
src/vs/workbench/contrib/userDataSync/
src/vs/workbench/contrib/mcp/
```

### 需要清理的 main 文件引用
- `src/vs/workbench/workbench.desktop.main.ts`
- `src/vs/workbench/workbench.web.main.ts`
- `src/vs/workbench/workbench.common.main.ts`
- `src/vs/workbench/api/browser/extensionHost.contribution.ts`

## 预期结果

1. **编译时间**: 显著减少
2. **安装包大小**: 显著减小
3. **启动时间**: 显著加快
4. **核心功能**: 仅保留编辑器和基础 UI

## 下一步

1. 运行完整编译验证
2. 清理其他可选的 contrib 模块
3. 验证构建和运行