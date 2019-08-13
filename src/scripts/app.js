import indexTpl from './views/index.html'
import positionController from './controller/PositionController'

$('#root').html(indexTpl)
positionController.render()