const router = {
  renderView() {
    let hash = location.hash
    switch(hash) {
      case '#position': 
        $('main').html('position')
        break;
      case '#search':
        $('main').html('search')
        break;
      case '#profile':
        $('main').html('profile')
        break;
    }

    $(`nav a[href='${hash}']`).closest('li').addClass('active').siblings().removeClass('active')
  },

  init() {
    window.addEventListener('load', this.renderView)
    window.addEventListener('hashchange', this.renderView)
  }
}

export {
  router
}