import {Component} from 'react'
import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaSearch} from 'react-icons/fa'
import {IoIosCloseCircle} from 'react-icons/io'
import './index.css'

class Header extends Component {
  state = {isMenuOpen: false, searchPostsInput: '', isSearhBtnClicked: false}

  onClickHamburgerMenuBtn = () => {
    this.setState({isMenuOpen: true})
  }

  onClickCloseBtn = () => {
    this.setState({isMenuOpen: false, isSearhBtnClicked: false})
  }

  onClickLogoutBtn = () => {
    Cookies.remove('jwt_token')
    const {history} = this.props
    history.replace('/login')
  }

  onChangeSearchPostsInput = event => {
    this.setState({searchPostsInput: event.target.value})
  }

  onClickSearchIcon = () => {
    const {searchPostsInput} = this.state
    const {onSearchPosts, onResetPosts} = this.props

    if (searchPostsInput.trim() !== '' && onSearchPosts) {
      onSearchPosts(searchPostsInput)
    } else {
      onResetPosts()
    }
  }

  onClickSaerchText = () => {
    this.setState({isSearhBtnClicked: true})
  }

  render() {
    const {isMenuOpen, searchPostsInput, isSearhBtnClicked} = this.state
    return (
      <>
        <div className="headerContainer">
          <div className="headerLogoContainer">
            <Link to="/" className="nav-link">
              <img
                src="https://res.cloudinary.com/dcn7xe65r/image/upload/v1768988625/logo_olqixe.svg"
                alt="website logo"
                className="headerWebsiteLogo"
              />
            </Link>
            <h1 className="headerLogoName">Insta Share</h1>
          </div>
          <div className="desktopSearchAndMenuContainer">
            <div className="searchBoxContainer">
              <input
                type="search"
                className="searchInput"
                placeholder="Search Caption"
                value={searchPostsInput}
                onChange={this.onChangeSearchPostsInput}
              />
              <button
                type="button"
                className="searchIconBtnContainer"
                onClick={this.onClickSearchIcon}
                data-testid="searchIcon"
              >
                <FaSearch className="searchIcon" testid="searchIcon" />
              </button>
            </div>
            <ul className="desktopHeaderMenuContainer">
              <Link to="/" className="nav-link">
                <li className="headerMenuListItem">Home</li>
              </Link>
              <Link to="/my-profile" className="nav-link">
                <li className="headerMenuListItem">Profile</li>
              </Link>
            </ul>
            <button
              type="button"
              className="logoutBtn"
              onClick={this.onClickLogoutBtn}
            >
              Logout
            </button>
          </div>
          <button type="button" className="mobileMenuBtn">
            <img
              src="https://res.cloudinary.com/dcn7xe65r/image/upload/v1769164881/menu_eoxtvz.svg"
              alt="hamburger menu"
              className="menuLogo"
              onClick={this.onClickHamburgerMenuBtn}
            />
          </button>
        </div>
        {isMenuOpen && (
          <div className="mobileMenuOptionsContainer">
            {isSearhBtnClicked ? (
              <div className="searchBoxContainer">
                <input
                  type="search"
                  className="searchInput"
                  placeholder="Search Caption"
                  value={searchPostsInput}
                  onChange={this.onChangeSearchPostsInput}
                />
                <button
                  type="button"
                  className="searchIconBtnContainer"
                  onClick={this.onClickSearchIcon}
                  data-testid="searchIcon"
                >
                  <FaSearch className="searchIcon" />
                </button>
              </div>
            ) : (
              <ul className="mobileMenuOptionsListContainer">
                <Link to="/" className="nav-link">
                  <li className="headerMenuListItem">Home</li>
                </Link>
                <button
                  type="button"
                  className="headerSearchBtn"
                  onClick={this.onClickSaerchText}
                >
                  <li className="headerSearchText">Search</li>
                </button>
                <Link to="/my-profile" className="nav-link">
                  <li className="headerMenuListItem">Profile</li>
                </Link>
                <li>
                  <button
                    type="button"
                    className="logoutBtn"
                    onClick={this.onClickLogoutBtn}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
            <button
              type="button"
              className="menuCloseBtn"
              onClick={this.onClickCloseBtn}
            >
              <IoIosCloseCircle className="closeIconLogo" />
            </button>
          </div>
        )}
      </>
    )
  }
}

export default withRouter(Header)
