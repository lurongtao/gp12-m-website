const router = {
  renderView() {
    let state = history.state || '/position'
    switch(state.path) {
      case '/position': 
        $('main').html('position')
        break;
      case '/search':
        $('main').html('search')
        break;
      case '/profile':
        $('main').html('profile')
        break;
    }

    $(`nav a[href='${state.path}']`).closest('li').addClass('active').siblings().removeClass('active')
  },

  init() {
    let that = this
    $('nav a').on('click', function(event) {
      event.preventDefault()

      let path = $(this).attr('href')
      history.pushState({path}, null, path)

      that.renderView()

      // $(this).closest('li').addClass('active').siblings().removeClass('active')
    })
    window.addEventListener('popstate', this.renderView)
    window.addEventListener('load', this.renderView)

  }
}

export {
  router
}