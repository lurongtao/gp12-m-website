const indexTpl = require('../views/index.html')

import PositionController from './PositionController'
import SearchController from './SearchController'
import ProfileController from './ProfileController'

class IndexController {
  constructor () {
    this.render()
    this.bindTabbarEvent()
    this.bindHashChange()

    this.components = {
      position: PositionController,
      search: SearchController,
      profile: ProfileController
    }
  }

  render () {
    $('#root').html(indexTpl)
  }

  bindHashChange () {
    $(window).on('hashchange', () => {
      let hash = location.hash && location.hash.substr(1) || 'position'
      this.setTabActive(hash)
      this.renderMain(this.components[hash])
    })
    $(window).on('load', () => {
      let hash = location.hash && location.hash.substr(1) || 'position'
      location.hash = hash
      this.renderMain(this.components[hash])
      this.setTabActive(hash)
    })
  }

  renderMain(controller) {
    controller.render()
  }

  setTabActive (hash) {
    $(`footer li[data-hash=${hash}]`).addClass('active').siblings().removeClass('active')
  }

  bindTabbarEvent () {
    $('footer li').on('tap', function () {
      let dataHash = $(this).attr('data-hash')
      location.hash = dataHash
    })
  }
}

export default new IndexController()