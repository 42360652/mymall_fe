const path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
//获取html-webpack-plugin参数的方法
//环境变量配置 dev / online
var WEBPACK_ENV = process.env.WEBPACK_ENV || 'dev';


var getHtmlConfig = function (name) {
    return {
        template : './src/view/'+ name +'.html',
        filename : 'view/'+ name +'.html',
        inject: true,
        hash: true,
        chunks: ['common',name]
    }
}

var config = {
    entry: {
        'common' : ['./src/page/common/index.js'],
        'index': ['./src/page/index/index.js'],
        'login': ['./src/page/login/index.js'],
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname,'dist')
    },
    externals :{
        'jquery' : 'window.JQuery'
    },

    module:{
      rules:[
          {
              test : /\.css$/,
              use: ExtractTextPlugin.extract({
                  fallback: 'style-loader',
                  use:'css-loader'
              })
          },
          {
              test: /\.(gif|png|jpg|woff|svg|eot|ttf)\??.*$/,
              loader: 'url-loader?limit=100&name=resource/[name].[ext]'
          },
          {
              test: /\.string$/,
              loader: 'html-loader'
          }
      ]
    },

    plugins: [
        //css单独打包
        new ExtractTextPlugin('css/[name].css'),
        //html模板的处理
        new HtmlWebpackPlugin(getHtmlConfig('index')),
        new HtmlWebpackPlugin(getHtmlConfig('login'))
    ],

    //独立通用模块
    optimization:{
        splitChunks :{
            cacheGroups :{
                commons : {
                    chunks : 'initial',
                    minChunks : 2,
                    maxInitialRequests : 5,
                    minSize : 0,
                    name : 'common'
                }
            }
        }

    }
};

if ('dev' === WEBPACK_ENV) {
    config.entry.common.push('webpack-dev-server/client?http://localhost:8088/');
}

module.exports = config;