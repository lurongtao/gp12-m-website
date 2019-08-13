import indexTpl from './views/index.html'
import profileController from './controller/ProfileController'
import { activeNav, bindClickToTab } from './utils/commonUtils'

$('#root').html(indexTpl)
profileController.render()
activeNav()
bindClickToTab()