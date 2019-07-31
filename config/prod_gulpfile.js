const { series, parallel } = require('gulp')

function defaultTask() {
  console.log(1)
  return new Promise((resolve, reject) => {
    resolve('test')
  })
}

exports.default = series(defaultTask)
