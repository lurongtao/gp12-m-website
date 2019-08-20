import index from '../controllers/index'
import error from '../controllers/error'
import home from '../controllers/home'
import position from '../controllers/position'
import search from '../controllers/search'
import profile from '../controllers/profile'
import details from '../controllers/details'

var socket = io.connect('http://localhost:8082')

socket.on('message', function(msg){
  // console.log(0)
  position.render()
})

export default class Router {
  constructor(obj) { // 生命周期函数
    this.mode = obj.mode
    // this.mode = 'history'
    // 路由配置
    this.routes = {
      '/index': index,
      '/index/home': home,
      '/index/error': error,
      '/index/details': details,
      '/index/home/position': position,
      '/index/home/search': search,
      '/index/home/profile': profile
    }
    // 组件挂载根元素
    this.root = $('#main')
    // 导航菜单列表
    this.navList = $('nav a')
    this.init()
  }

  init() {
    index.render()
    if (this.mode === 'hash') {
      window.addEventListener('load', this.hashRefresh.bind(this), false);
      window.addEventListener('hashchange', this.hashRefresh.bind(this), false);
    } else {
      this.bindLink()
      window.addEventListener('load', this.loadView.bind(this, location.pathname));
      window.addEventListener('popstate', this.historyRefresh.bind(this));
    }
  }
  /**
   * history模式劫持 a链接
   */
  bindLink() {
    $('nav').on('click', 'a', this.handleLink.bind(this))
  }
  /**
   * history 处理a链接
   * @param  e 当前对象Event
   */
  handleLink(e) {
    e.preventDefault();
    // 获取元素路径属性
    let href = $(e.target).attr('href')
    // 对非路由链接直接跳转
    if (href.slice(0, 1) !== '#') {
      window.location.href = href
    } else {
      let path = href.slice(1)
      history.pushState({
        path: path
      }, null, path)
      // 加载相应页面
      this.loadView(path.split('?')[0])
    }
  }
  /**
   * hash路由刷新执行
   * @param {object} e
   */
  hashRefresh(e) {
    // console.log(e)
    if (e.newURL) {
      var newURL = e.newURL.split('#')[1];
      var oldURL = e.oldURL.split('#')[1];
    }
    // 获取当前路径,默认'/index'
    var currentURL = location.hash.slice(1).split('?')[0] || '/index/home/position';
    this.loadView(currentURL)
  }
  /**
   * history模式刷新页面
   * @param  e  当前对象Event
   */
  historyRefresh(e) {
    const state = e.state || {}
    const path = state.path.split('?')[0] || null
    if (path) {
      this.loadView(path)
    }
  }
  /**
   * 加载页面
   * @param {string} currentURL 
   */
  loadView(currentURL) {
    if (this.mode === 'history' && currentURL === '/') {
      history.replaceState({
        path: '/'
      }, null, '/')
      currentURL = '/index/home/position'
    }
    // 多级链接拆分为数组,遍历依次加载
    this.currentURLlist = currentURL.slice(1).split('/')
    this.url = ""
    this.currentURLlist.forEach((item, index) => {
      // 导航菜单激活显示
      if (index === 0) {
        this.navActive(item)
      }
      this.url += "/" + item
      this.controllerName = this.routes[this.url]
      // 404页面处理
      if (!this.controllerName) {
        this.errorPage()
        return false
      }
      // 对于嵌套路由的处理
      if (this.oldURL && this.oldURL[index] == this.currentURLlist[index]) {
        this.handleSubRouter(item, index)
      } else {
        this.controller(this.controllerName, this.url)
      }
    });
    // 记录链接数组,后续处理子级组件
    this.oldURL = JSON.parse(JSON.stringify(this.currentURLlist))
  }
  /**
   * 处理嵌套路由
   * @param {string} item 链接list中当前项
   * @param {number} index 链接list中当前索引
   */
  handleSubRouter(item, index) {
    // 新路由是旧路由的子级
    if (this.oldURL.length < this.currentURLlist.length) {
      // 相同路由部分不重新加载
      if (item !== this.oldURL[index]) {
        this.controller(this.name)
        console.log('解绑状态监听事件')
        store.getSubject().unsubscribe('stateChange')
      }
    }
    // 新路由是旧路由的父级
    if (this.oldURL.length > this.currentURLlist.length) {
      var len = Math.min(this.oldURL.length, this.currentURLlist.length)
      // 只重新加载最后一个路由
      if (index == len - 1) {
        this.controller(this.name)
      }
    }
  }
  /**
   * 404页面处理
   */
  errorPage() {
    if (this.mode === 'hash') {
      location.href = '#/index/error'
    } else {
      history.replaceState({
        path: '/index/error'
      }, null, '/index/error')
      this.loadView('/index/error')
    }
  }
  /**
   * 组件控制器
   * @param {string} name 
   */
  controller(name, item) {
    name.render() // name 是当前路由匹配的那个 controller
    this.navActive(item) // 切换路由时导航高亮
  }
  /**
   * 手动跳转路由
   * @param {string} path 
   */
  push(path) {
    if (this.mode === 'hash') {
      location.hash = '#' + path
    } else {
      history.pushState({
        path: path
      }, null, path)
      // 加载相应页面
      this.loadView(path.split('?')[0])
    }
  }
  /**
   * 绑定组件对象中events 事件
   * @desc 将组件对象中this通过call绑定
   * ! 仅支持绑定当前组件下的DOM事件
   */
  bindEvents() {
    var self = this;
    //eventType: 事件类型;selector: 事件作用对象;handleEvent: 事件执行方法
    var eventType = "",
      selector = "",
      handleEvent = "";
    var Event = function (eventType, selector, handleEvent) {
      self.$el.find(selector).on(eventType, (e) => {
        // 执行事件
        self[handleEvent](e)
      })
    }
    // 遍历events对象
    for (var index in self.events) {
      eventType = index.match(/[0-9A-Za-z]+\s/i)[0].trim(); // 匹配事件名
      selector = index.replace(/[0-9A-Za-z]+\s/i, "").trim(); // 匹配事件作用元素选择器
      handleEvent = self.events[index]; // 匹配处理事件名称
      var obj = new Event(eventType, selector, handleEvent);
      obj = null; // 用完即释放空间
    }
    Event = null
  }
  /**
   * 导航激活显示
   * @param  item 当前router对象
   */
  navActive(item) {
    $('nav a').filter(`[href="#${item}"]`).closest('li').addClass('active').siblings().removeClass('active')
  }
}