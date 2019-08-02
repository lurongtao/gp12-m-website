/*
 * 1、启动一个Webserver
 * 2、JS 模块化
 * 3、CSS 模块化（scss）
 * 4、Mock数据
 */

const connect = require('gulp-connect')
const webpack = require('webpack-stream')
const sass = require('gulp-sass')
const del = require('del')
const proxy = require('http-proxy-middleware')

const { 
  series,
  src,
  dest,
  watch,
  parallel
} = require('gulp')

// 拷贝html
function copyHtml () {
  return src(['../src/*.html'])
    .pipe(dest('../dev'))
    .pipe(connect.reload())
}

// 拷贝 assest
function copyAssets () {
  return src(['../src/assets/**/*'])
    .pipe(dest('../dev/assets'))
    .pipe(connect.reload())
}


// 启动一个本地的 web server
function webServer () {
  return connect.server({
    host: 'localhost',
    root: '../dev',
    port: 8000,
    livereload: true,
    middleware() {
      return [
        proxy('/api', {
          target: 'https://m.lagou.com',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        })
      ]
    }
  })
}

// JS 模块化
function packJS () {
  return src('../src/scripts/app.js')
    .pipe(webpack({
        mode: 'development',
        entry: '../src/scripts/app.js',
        output: {
          filename: 'app.js'
        },
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /(node_modules|bower_components)/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'],
                  plugins: ['@babel/plugin-transform-runtime']
                }
              }
            },
            {
              test: /\.html$/,
              loader: 'string-loader'
            }
          ]
        }
      }))
    .pipe(dest('../dev/scripts'))
    .pipe(connect.reload())
}

// 删除dev文件夹
function delDevFolder() {
  return del('../dev/**', {
    force: true
  })
}

// CSS 模块化
function packCSS () {
  return src(['../src/styles/app.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('../dev/styles'))
    .pipe(connect.reload())
}

function watcher () {
  watch('../src/*.html', series(copyHtml))
  watch('../src/scripts/**/*', packJS)
  watch('../src/styles/**/*.scss', packCSS)
  watch('../src/assets/**/*', copyAssets)
}

exports.default = series(delDevFolder, packJS, packCSS, parallel(copyAssets,copyHtml), parallel(webServer, watcher))