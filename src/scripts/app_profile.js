import indexTpl from './views/index.html'
import profileController from './controller/ProfileController'

$('#root').html(indexTpl)
profileController.render()