const indexTpl = require('../views/index.html')
const positionTpl = require('../views/position.html')

import PositionController from './PositionController'

document.querySelector('#root').innerHTML = indexTpl
document.querySelector('main').innerHTML = positionTpl

new PositionController()