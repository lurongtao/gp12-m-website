/*
 * 1、JS 模块化
 * 2、CSS 模块化（scss）
 * 3、版本号控制
 * 4、代码压缩
 */

const webpack = require('webpack-stream')
const sass = require('gulp-sass')
const rev = require('gulp-rev')
const revCollector = require('gulp-rev-collector')
const del = require('del')
const cleanCSS = require('gulp-clean-css')
const htmlmin = require('gulp-htmlmin')

const { 
  series,
  src,
  dest
} = require('gulp')

// 拷贝html
function copyHtml () {
  return src(['../src/*.html', '../build/rev/**/*.json'])
    .pipe(revCollector())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(dest('../build'))
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
    .pipe(dest('../build/scripts'))
    .pipe(rev.manifest())
    .pipe(dest('../build/rev/scripts'))
}

// 删除dev文件夹
function delDevFolder() {
  return del('../build/**', {
    force: true
  })
}

// CSS 模块化
function packCSS () {
  return src('../src/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rev())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(dest('../build/styles'))
    .pipe(rev.manifest())
    .pipe(dest('../build/rev/styles'))
}

exports.default = series(delDevFolder, packJS, packCSS, copyHtml)