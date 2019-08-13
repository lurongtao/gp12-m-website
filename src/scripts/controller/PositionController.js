

import positionTpl from '../views/position.html'
import positionListTpl from '../views/position_list.html'

import Http from '../model/http'
import BScroll from 'better-scroll'

class PositionController {
  constructor() {
    // this.render()
  }
  async render() {
    let pageNo = 2

    $('main').html(positionTpl)

    let list = (await Http.get()).content.data.page.result

    let html = template.render(positionListTpl, {
      list
    })

    $('#pos-list ul li.head').after(html)

    let bScroll = new BScroll('#pos-list', {
      probeType: 2,
      pullDownRefresh: true
    })

    // 初始化scroll位置，向上滚动 40px
    bScroll.scrollTo(0, -40)

    // 下拉刷新
    let $head = $('#pos-list .head img')
    let $foot = $('#pos-list .foot img')

    bScroll.on('scroll', function() {
      if (this.y > 20 || this.y < -40) {
        $head.addClass('up')
      }

      let detaY = this.y - this.maxScrollY
      if (detaY < 0 ) {
        $foot.addClass('down')
      }

    })

    bScroll.on('touchEnd', function() {
      if (this.y < 20 && this.y > -40) {
        this.scrollTo(0, -40, 200)
      }
      if (this.y > 20) {
        $head.attr('src', '/assets/images/ajax-loader.gif')

        $.ajax({
          url: '/api/listmore.json?pageNo=2&pageSize=2',
          success: (result) => {
            
            let data = result.content.data.page.result
            list = [ ...data, ...list ]
            let html = template.render(positionListTpl, {
              list
            })
            $('#pos-list ul li.head').after(html)

            this.refresh()
            this.scrollTo(0, -40, 200)
            $head.removeClass('up')
            $head.attr('src', '/assets/images/arrow.png')
          }
        })
      }

      let detaY = this.y - this.maxScrollY

      if (detaY > 0 && detaY < 40 ) {
        this.scrollTo(0, this.maxScrollY + 40, 200)
      }

      if (detaY < 0) {
        $foot.attr('src', '/assets/images/ajax-loader.gif')

        $.ajax({
          url: `/api/listmore.json?pageNo=${pageNo}&pageSize=15`,
          success: (result) => {
            
            let data = result.content.data.page.result
            list = [ ...list, ...data ]
            let html = template.render(positionListTpl, {
              list
            })
            $('#pos-list ul li.foot').before(html)

            this.refresh()
            this.scrollTo(0, this.maxScrollY + 40, 200)
            $foot.removeClass('down')
            $foot.attr('src', '/assets/images/arrow.png')

            pageNo++
          }
        })
      }
    })

  }
}

export default new PositionController()