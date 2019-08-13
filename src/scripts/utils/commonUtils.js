const activeNav = () => {
  let path = location.pathname.substr(1).split('.')[0] || 'index'
  $(`footer li[data-path=${path}]`).addClass('active').siblings().removeClass('active')
}

const bindClickToTab = () => {
  $('footer li').on('tap', function() {
    location.href = $(this).attr('data-path') + '.html'
  })
}

export {
  activeNav,
  bindClickToTab
}