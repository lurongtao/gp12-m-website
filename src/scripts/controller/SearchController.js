import searchTpl from '../views/search.html'

class SearchController {
  constructor () {
  }

  render () {
    $('main').html(searchTpl)
  }
}

export default new SearchController()