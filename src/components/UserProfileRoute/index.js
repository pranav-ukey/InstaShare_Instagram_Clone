import {Component} from 'react'
import {BsGrid3X3} from 'react-icons/bs'
import {BiCamera} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class UserProfileRoute extends Component {
  state = {
    userProfileDetailsApiStatus: apiStatusConstants.inProgress,
    userProfileDetailsList: {},
  }

  componentDidMount() {
    this.getUserProfileList()
  }

  onClickTryAgainBtn = () => {
    this.getUserProfileList()
  }

  getUserProfileList = async () => {
    this.setState({userProfileDetailsApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    console.log(this.props)
    const userProfileDetailsApiUrl = `https://apis.ccbp.in/insta-share/users/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    try {
      const response = await fetch(userProfileDetailsApiUrl, options)
      console.log(response)

      if (response.ok === true) {
        const data = await response.json()
        console.log(data)
        const formattedData = {
          followersCount: data.user_details.followers_count,
          followingCount: data.user_details.following_count,
          id: data.user_details.id,
          posts: data.user_details.posts,
          postsCount: data.user_details.posts_count,
          profilePic: data.user_details.profile_pic,
          stories: data.user_details.stories,
          userBio: data.user_details.user_bio,
          userId: data.user_details.user_id,
          userName: data.user_details.user_name,
        }
        console.log(formattedData)
        this.setState({
          userProfileDetailsList: formattedData,
          userProfileDetailsApiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({userProfileDetailsApiStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({userProfileDetailsApiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {userProfileDetailsList} = this.state

    const {
      followersCount,
      followingCount,
      id,
      posts = [],
      postsCount,
      profilePic,
      stories = [],
      userBio,
      userId,
      userName,
    } = userProfileDetailsList

    return (
      <>
        <Header showSearch={false} />
        <div key={id} className="myProfileContainer">
          <div className="profileAndDetailsContainer">
            <img
              src={profilePic}
              alt="user profile"
              className="myProfileDesktopProfilePic"
            />
            <div className="profileTextDetailsContainer">
              <h1 className="myProfileUsername">{userName}</h1>
              <div className="myProfilePicAndCountContainer">
                <img
                  src={profilePic}
                  alt="profile"
                  className="myProfileMobileProfilePic"
                />
                <div className="followerCountDetailsContainer">
                  <p className="followerCountDetails">
                    {postsCount}
                    <span className="followerCountDetailsText">posts</span>
                  </p>
                  <p className="followerCountDetails">
                    {followersCount}
                    <span className="followerCountDetailsText">followers</span>
                  </p>
                  <p className="followerCountDetails">
                    {followingCount}
                    <span className="followerCountDetailsText">following</span>
                  </p>
                </div>
              </div>
              <p className="myProfileName">{userId}</p>
              <p className="myProfileBio">{userBio}</p>
            </div>
          </div>
          {stories.length !== 0 && (
            <ul className="myProfileStoriesContainer">
              {stories.map(eachStory => (
                <li key={eachStory.id} className="myProfileStory">
                  <img
                    src={eachStory.image}
                    alt="user story"
                    className="myProfileStoryImage"
                  />
                </li>
              ))}
            </ul>
          )}
          <hr className="myProfileHorizontalRuleSeparator" />
          <div className="myProfilePostHeadingContainer">
            <BsGrid3X3 className="bsGridIcon" />
            <h1 className="myProfilePostText">Posts</h1>
          </div>
          {posts.length === 0 && (
            <div className="myProfileEmptyPostViewContainer">
              <div className="BiCameraIconContainer">
                <BiCamera className="BiCameraIcon" />
              </div>
              <h1 className="noPostText">No Posts Yet</h1>
            </div>
          )}
          <ul className="myProfilePostsContainer">
            {posts.map(eachPost => (
              <li key={eachPost.id} className="myProfilePostsList">
                <img
                  src={eachPost.image}
                  alt="user post"
                  className="myProfilePostImage"
                />
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <>
      <Header />
      <div className="myProfileLoaderContainer" testid="loader">
        <Loader type="TailSpin" color="#4094EF" height={80} width={80} />
      </div>
    </>
  )

  renderFailureView = () => (
    <>
      <Header />
      <div className="myProfileFailureView">
        <img
          src="https://res.cloudinary.com/dcn7xe65r/image/upload/v1769573861/Group_7522_xl2pn6.png"
          alt="failure view"
          className="myProfileFailureViewImage"
        />
        <p className="failureText">Something went wrong. Please try again</p>
        <button
          type="button"
          className="tryAgainBtn"
          onClick={this.onClickTryAgainBtn}
        >
          Try again
        </button>
      </div>
    </>
  )

  render() {
    const {userProfileDetailsApiStatus} = this.state
    switch (userProfileDetailsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return this.renderFailureView()
    }
  }
}

export default UserProfileRoute
