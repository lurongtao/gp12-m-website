import positionListTpl from '../views/position_list.html'

import Http from '../model/http'

class PositionController {
  constructor() {
    this.render()
  }
  async render() {
    let list = (await Http.get()).content.data.page.result

    let html = template.render(positionListTpl, {
      list
    })

    document.querySelector('#pos-list').innerHTML = html
  }
}

export default PositionController