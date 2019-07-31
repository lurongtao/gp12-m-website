/*
 * 1、启动一个Webserver
 * 2、JS 模块化
 * 3、CSS 模块化（scss）
 * 4、版本号控制
 * 5、代码压缩
 * 6、Mock数据
 */

const connect = require('gulp-connect')
const webpack = require('webpack-stream')
const sass = require('gulp-sass')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')
const del = require('del')
const cleanCSS = require('gulp-clean-css')
const htmlmin = require('gulp-htmlmin')
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
  return src(['../src/*.html', '../dev/rev/**/*.json'])
    .pipe(revCollector())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('../dev'))
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
        mode: 'production',
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
            }
          ]
        }
      }))
    .pipe(rev())
    .pipe(dest('../dev/scripts'))
    .pipe(rev.manifest())
    .pipe(dest('../dev/rev/scripts'))
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
  return src('../src/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rev())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(dest('../dev/styles'))
    .pipe(rev.manifest())
    .pipe(dest('../dev/rev/styles'))
    .pipe(connect.reload())
} 

// function copyJS () {
//   return src('../src/scripts/*.js')
//     .pipe(dest('../dev/scripts'))
//     .pipe(connect.reload())
// }

function watcher () {
  watch('../src/*.html', series(copyHtml))
  // watch('../src/scripts/*.js', series(copyJS))
  watch('../src/scripts/**/*.js', packJS)
  watch('../src/styles/**/*.scss', packCSS)
}

exports.default = series(delDevFolder, packJS, packCSS, copyHtml, parallel(webServer, watcher))