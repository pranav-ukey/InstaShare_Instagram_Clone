import {withRouter} from 'react-router-dom'
import './index.css'

const NotFoundRoute = props => {
  const onClickHomePageBtn = () => {
    const {history} = props
    history.replace('/')
  }
  return (
    <div className="notFoundContainer">
      <img
        src="https://res.cloudinary.com/dcn7xe65r/image/upload/v1769665152/erroring_1_k30nw1.png"
        alt="page not found"
        className="notFoundImg"
      />
      <h1 className="heading">Page Not Found</h1>
      <p className="notFoudDescription">
        we are sorry, the page you requested could not be found. Please go back
        to the homepage.
      </p>
      <button
        type="button"
        className="homePageBtn"
        onClick={onClickHomePageBtn}
      >
        Home Page
      </button>
    </div>
  )
}

export default withRouter(NotFoundRoute)
