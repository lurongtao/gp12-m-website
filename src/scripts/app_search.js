import indexTpl from './views/index.html'
import searchController from './controller/SearchController'

$('#root').html(indexTpl)
searchController.render()