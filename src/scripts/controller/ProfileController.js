import profileTpl from '../views/profile.html'

class ProfileController {
  constructor () {
  }

  render () {
    $('main').html(profileTpl)
  }
}

export default new ProfileController()