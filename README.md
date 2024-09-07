# react-isomorphism
# react 同构模板

### 一、运行

```bash
    // 镜像配置
    npm config set registry https://registry.npm.taobao.org
    // 依赖安装
    npm i
    // 打包
    npm build
    // 启动
    npm run start
    // 本地调试
    npm run dev
```

### 二、笔记

```text
1. 本地调试 SSR 访问地址：http://localhost:8080/index (index、note 路由命中的才是服务端渲染)
2. 本地调试 CSR 访问地址：http://localhost:8080/index.html
2. 本地调试 CSR 访问地址：http://localhost:3000/index.html

2. 记录日常学习笔记
```

### 三、常用链接

[React SSR服务端渲染与同构实践](https://xiaochen1024.com/cdn/fe_interview/fe-react-docs-react-ssr-docs-13-%E4%BD%BF%E7%94%A8%E9%AB%98%E9%98%B6%E7%BB%84%E4%BB%B6%E4%BC%98%E5%8C%96%E6%95%B0%E6%8D%AE%E5%90%8C%E6%9E%84.html)

[markdown 使用教程](https://www.runoob.com/markdown/md-tutorial.html)

[eslint 配置说明文档](https://eslint.bootcss.com/docs/user-guide/configuring/)

[eslint 配合 Prettier 使用](https://blog.windstone.cc/front-end/engineering/eslint/prettier-eslint.html#%E9%85%8D%E7%BD%AE-prettier-%E8%A7%84%E5%88%99)

[TypeScript 配置说明文档](https://www.tslang.cn/docs/home.html)

### 四、代码格式化

> 本地自动格式化代码

1. 安装 eslint 插件
2. 添加 .eslintrc.js 配置，运行命令 npx eslint --init
3. 修改 vscode 配置，在 setting.json 文件中增加如下配置，使其保存自动按照 eslint 规则格式化

```text
    // setting.json 文件

    "editor.formatOnType": true,
    "editor.formatOnSave": true,
    "eslint.codeAction.showDocumentation": {
        "enable": true
    },
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true,
    },
    "eslint.validate": ["javascript", "javascriptreact", "html", "vue"],
```

4. 安装 prettier 插件
5. 添加 prettier 插件配置，运行命令： echo {}> .prettierrc.json ，再运行命令：echo {}> .prettierignore
6. 修改 vscode 配置，在 setting.json 文件中增加如下配置，使其保存自动按照 prettier 规则格式化

```text
    "[javascript]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[html]": {
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    }，
```

> 提交代码自动 check 代码格式并约束 commit 规则

1. 安装依赖：npm i prettier eslint eslint-plugin-prettier eslint-config-prettier husky lint-staged @commitlint/cli @commitlint/config-conventional -D
2. 创建.husky/目录并指定该目录为 git hooks 所在的目录：husky install
3. 添加 git hooks，运行一下命令创建 git hooks：
    1. npx husky add .husky/pre-commit "npx lint-staged"
    2. npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
4. 工具说明
    1. eslint-plugin-prettier eslint-config-prettier 解决 prettier 和 eslint 规则冲突问题，并优先使用 prettier
    2. @commitlint/cli @commitlint/config-conventional git 提交规范和规范配置

> 代码提交规范（config-conventional）

-   build： 影响项目构建或依赖项修改
-   chore： 其它修改
-   ci： 持续集成相关文件修改
-   docs： 文档修改
-   feat： 新功能、新特性（feature）
-   fix： 修复，修改 bug
-   perf： 更改代码，性能优化
-   refactor：代码重构（重构，在不影响代码内部行为、功能下的代码修改）
-   revert： 恢复上一次提交
-   style： 代码格式修改, 注意不是 css 修改（例如分号修改）
-   test： 测试用例新增、修改

### 五、实用工具
1. [png转ico](https://www.aconvert.com/cn/icon/png-to-ico/)