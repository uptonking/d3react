var path = require('path');
var webpack = require('webpack');
const FileManagerPlugin = require('filemanager-webpack-plugin');


module.exports = {
  context: __dirname,
  devtool: '#inline-source-map',

  entry: [
    './index.js',
  ],

  output: {
    path: __dirname + '/build',
    filename: 'bundle.js',
  },

  plugins: [
    new webpack.LoaderOptionsPlugin({
      debug: true
    }),
    new FileManagerPlugin({
      onEnd: [
        {
          copy: [
            //目录是相对于执行npm run demo的根目录，而不是webpack.config.js的位置
            {source: "./demo/build/bundle.js", destination: "./docs/bundle.js"}
          ]
        },
      ]
    }),
    // new webpack.HotModuleReplacementPlugin(),
    // new webpack.NoErrorsPlugin()
  ],

  resolve: {

    // 可以替换初始模块路径，此替换路径通过使用 resolve.alias 配置选项来创建一个别名
    alias: {
      'recharts': path.join(__dirname, '..', 'src/index.js'),
    },
  },

  module: {

    rules: [{
      test: /\.(js|jsx)$/,
      include: [
        __dirname,
        path.join(__dirname, '..', 'src'),
      ],
      use: {
        loader: 'babel-loader',
        // query: {
        //   plugins: ['lodash'],
        // },
      },
    }],


  },


};
