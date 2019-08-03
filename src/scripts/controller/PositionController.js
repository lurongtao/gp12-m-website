import positionTpl from '../views/position.html'
import positionListTpl from '../views/position_list.html'

import Http from '../model/http'
import BScroll from 'better-scroll'

class PositionController {
  constructor() {
    // this.render()
  }
  async render() {
    $('main').html(positionTpl)

    let list = (await Http.get()).content.data.page.result

    let html = template.render(positionListTpl, {
      list
    })

    $('#pos-list').html(html)

    let bScroll = new BScroll('#pos-list', {})
  }
}

export default new PositionController()