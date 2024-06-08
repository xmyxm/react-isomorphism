const path = require('path');
const nodeExternals = require('webpack-node-externals');
const packageFilePath = path.join(__dirname, '../dist/server')

module.exports = {
  target: 'node', // 指定 Node.js 环境
  mode: 'production', // 设置为生产模式
  entry: {
    index: ['../src/app/page/index.tsx'],
    note: ['./src/app/page/note.tsx'],
},
  output: {
    path: packageFilePath,
    filename: 'server.js',
    filename: '[name]_new.js',
    libraryTarget: 'commonjs2' // 导出模块的格式
  },
  externals: [nodeExternals()], // 排除 node_modules 中的模块
  module: {
    rules: [
      {
        test: /\.jsx?$/, // 匹配 JS 和 JSX 文件
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // Babel 配置选项
              presets: ['@babel/preset-env', '@babel/preset-react'], // Babel 预设
              plugins: ['@babel/plugin-transform-runtime'] // Babel 插件
            }
          },
          {
            loader: 'ts-loader',
            options: {
              // ts-loader 配置选项
            }
          }
        ]
      },
      // 可以添加样式和图片等其他 loader
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx'] // 解析文件扩展名
  }
};