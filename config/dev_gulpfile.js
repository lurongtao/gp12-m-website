const connect = require('gulp-connect')
const webpack = require('webpack-stream')

const { 
  series,
  src,
  dest,
  watch,
  parallel
} = require('gulp')

// 拷贝html
function copyHtml () {
  return src('../src/*.html')
    .pipe(dest('../dev'))
    .pipe(connect.reload())
}

// 启动一个本地的 web server
function webServer () {
  return connect.server({
    host: 'localhost',
    root: '../dev',
    port: 8000,
    livereload: true
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
        }
      }))
    .pipe(dest('../dev/scripts'))
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
}

exports.default = series(copyHtml, packJS, parallel(webServer, watcher))