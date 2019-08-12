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

    let bScroll = new BScroll('#pos-list', {
      probeType: 2
    })

    // 初始化scroll位置，向上滚动 40px
    bScroll.scrollTo(0, -40)

    // 下拉刷新
    // bScroll.on('scroll', function() {
    //   if (this.y < 20 && this.y > -40) {

    //   } else {
    //     console.log(0)
    //   }
    // })

    bScroll.on('touchEnd', function() {
      if (this.y < 20 && this.y > -40) {
        this.scrollTo(0, -40, 200)
      } else {
        console.log(0)
      }
    })

  }
}

export default new PositionController()