import indexTpl from './views/index.html'
import searchController from './controller/SearchController'
import { activeNav, bindClickToTab } from './utils/commonUtils'

$('#root').html(indexTpl)
searchController.render()
activeNav()
bindClickToTab()