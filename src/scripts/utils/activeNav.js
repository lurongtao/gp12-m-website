export default {
  activeNav() {
    
    $(`footer li[data-hash=${path}]`).addClass('active').siblings().removeClass('active')
  }
}