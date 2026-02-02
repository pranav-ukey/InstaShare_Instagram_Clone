import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'
import './index.css'

class LoginRoute extends Component {
  state = {username: '', password: '', showError: false, errorMsg: ''}

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitError = errorMsg => {
    this.setState({showError: true, errorMsg})
  }

  onSubmitLoginDetails = async event => {
    event.preventDefault()
    const {username, password} = this.state

    const url = 'https://apis.ccbp.in/login'
    const userDetails = {username, password}

    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()
    console.log(response)
    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitError(data.error_msg)
    }
  }

  render() {
    const {username, password, showError, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="loginPageContainer">
        <img
          src="https://res.cloudinary.com/dcn7xe65r/image/upload/v1768987918/Illustration_mhigwh.png"
          alt="website login"
          className="websiteLoginImg"
        />
        <div className="loginFormContainer">
          <div className="loginwebsiteLogoContainer">
            <img
              src="https://res.cloudinary.com/dcn7xe65r/image/upload/v1768988625/logo_olqixe.svg"
              alt="website logo"
              className="loginWebsiteLogo"
            />
            <h1 className="loginWebsiteLogoName">Insta Share</h1>
          </div>
          <form onSubmit={this.onSubmitLoginDetails}>
            <div className="usernameInputContainer">
              <label htmlFor="username">USERNAME</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={this.onChangeUsername}
              />
            </div>
            <div className="passwordInputContainer">
              <label htmlFor="password">PASSWORD</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={this.onChangePassword}
              />
            </div>
            {showError && <p className="errorMsg">{errorMsg}</p>}
            <button type="submit" className="loginButton">
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }
}

export default LoginRoute
