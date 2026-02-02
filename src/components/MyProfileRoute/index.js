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

class MyProfileRoute extends Component {
  state = {
    myProfileApiStatus: apiStatusConstants.inProgress,
    myProfileDetailsList: [],
  }

  componentDidMount() {
    this.getMyProfileDetails()
  }

  onClickTryAgainBtn = () => {
    this.getMyProfileDetails()
  }

  getMyProfileDetails = async () => {
    this.setState({myProfileApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const myProfileApiUrl = 'https://apis.ccbp.in/insta-share/my-profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(myProfileApiUrl, options)

      if (response.ok === true) {
        const data = await response.json()
        const formattedData = {
          followersCount: data.profile.followers_count,
          followingCount: data.profile.following_count,
          id: data.profile.id,
          posts: data.profile.posts,
          postsCount: data.profile.posts_count,
          profilePic: data.profile.profile_pic,
          stories: data.profile.stories,
          userBio: data.profile.user_bio,
          userId: data.profile.user_id,
          userName: data.profile.user_name,
        }
        this.setState({
          myProfileDetailsList: formattedData,
          myProfileApiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({myProfileApiStatus: apiStatusConstants.failure})
      }
    } catch (error) {
      this.setState({myProfileApiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {myProfileDetailsList} = this.state

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
    } = myProfileDetailsList

    return (
      <>
        <Header showSearch={false} />
        <div key={id} className="myProfileContainer">
          <div className="profileAndDetailsContainer">
            <img
              src={profilePic}
              alt="my profile"
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
                    alt="my story"
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
          {posts.length !== 0 && (
            <ul className="myProfilePostsContainer">
              {posts.map(eachPost => (
                <li key={eachPost.id} className="myProfilePostsList">
                  <img
                    src={eachPost.image}
                    alt="my post"
                    className="myProfilePostImage"
                  />
                </li>
              ))}
            </ul>
          )}
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
    const {myProfileApiStatus} = this.state

    switch (myProfileApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }
}

export default MyProfileRoute
