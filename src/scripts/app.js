import indexTpl from './views/index.html'
import positionController from './controller/PositionController'
import { activeNav, bindClickToTab } from './utils/commonUtils'

$('#root').html(indexTpl)
positionController.render()
activeNav()
bindClickToTab()