import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
import {BsHeart} from 'react-icons/bs'
import {FcLike} from 'react-icons/fc'
import {FaRegComment} from 'react-icons/fa'
import {BiShareAlt} from 'react-icons/bi'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class HomeRoute extends Component {
  state = {
    userStoryApiStatus: apiStatusConstants.initial,
    userStoriesList: [],
    postsApiStatus: apiStatusConstants.initial,
    postsList: [],
    searchApiStatus: apiStatusConstants.initial,
    isSearchIconClicked: false,
    searchInput: '',
  }

  componentDidMount() {
    this.getUserStories()
    this.getPosts()
  }

  getUserStories = async () => {
    this.setState({userStoryApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const userStoriesUrl = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    try {
      const response = await fetch(userStoriesUrl, options)
      const data = await response.json()
      const formattedData = data.users_stories.map(eachStory => ({
        userId: eachStory.user_id,
        userName: eachStory.user_name,
        storyUrl: eachStory.story_url,
      }))
      if (response.ok === true) {
        this.setState({
          userStoriesList: formattedData,
          userStoryApiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({userStoryApiStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({userStoryApiStatus: apiStatusConstants.failure})
    }
  }

  getPosts = async () => {
    this.setState({postsApiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')

    const postsUrl = 'https://apis.ccbp.in/insta-share/posts'
    const options = {
      method: 'GET',
      headers: {Authorization: `Bearer ${jwtToken}`},
    }
    try {
      const response = await fetch(postsUrl, options)

      if (!response.ok) {
        this.setState({postsApiStatus: apiStatusConstants.failure})
        return
      }

      const data = await response.json()
      const formattedPostsData = data.posts.map(eachPosts => ({
        postId: eachPosts.post_id,
        userId: eachPosts.user_id,
        userName: eachPosts.user_name,
        profilePic: eachPosts.profile_pic,
        imageUrl: eachPosts.post_details.image_url,
        caption: eachPosts.post_details.caption,
        comments: eachPosts.comments.map(comment => ({
          comment: comment.comment,
          userId: comment.user_id,
          userName: comment.user_name,
        })),
        createdAt: eachPosts.created_at,
        likesCount: eachPosts.likes_count,
        isLiked: false,
      }))

      if (response.ok === true) {
        this.setState({
          postsList: formattedPostsData,
          postsApiStatus: apiStatusConstants.success,
        })
      }
    } catch (error) {
      this.setState({postsApiStatus: apiStatusConstants.failure})
    }
  }

  getSearchedPosts = async searchInput => {
    this.setState({
      searchApiStatus: apiStatusConstants.inProgress,
      isSearchIconClicked: true,
      searchInput,
    })
    const jwtToken = Cookies.get('jwt_token')
    const searchPostsApiUrl = `https://apis.ccbp.in/insta-share/posts?search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    try {
      const response = await fetch(searchPostsApiUrl, options)
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        const updatedPosts = data.posts.map(eachPost => ({
          postId: eachPost.post_id,
          userId: eachPost.user_id,
          userName: eachPost.user_name,
          profilePic: eachPost.profile_pic,
          imageUrl: eachPost.post_details.image_url,
          caption: eachPost.post_details.caption,
          comments: eachPost.comments.map(comment => ({
            comment: comment.comment,
            userId: comment.user_id,
            userName: comment.user_name,
          })),
          createdAt: eachPost.created_at,
          likesCount: eachPost.likes_count,
        }))
        this.setState({
          postsList: updatedPosts,
          searchApiStatus: apiStatusConstants.success,
          isSearchIconClicked: true,
          searchInput,
        })
      } else {
        this.setState({
          searchApiStatus: apiStatusConstants.failure,
          isSearchIconClicked: true,
        })
      }
    } catch {
      this.setState({
        searchApiStatus: apiStatusConstants.failure,
        isSearchIconClicked: true,
      })
    }
  }

  onClickTryAgain = () => {
    this.getPosts()
  }

  onClickUserStoriesTryAgainBtn = () => {
    this.setState(
      {userStoryApiStatus: apiStatusConstants.inProgress},
      this.getUserStories,
    )
  }

  onClickSearchTryAgain = () => {
    const {searchInput} = this.state
    this.getSearchedPosts(searchInput)
  }

  onClickLikeDislikeBtn = async event => {
    const {postsList} = this.state
    const postId = event.currentTarget.value

    const clickedPost = postsList.find(post => post.postId === postId)

    this.setState(prevState => ({
      postsList: prevState.postsList.map(post =>
        post.postId === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likesCount: post.isLiked
                ? post.likesCount - 1
                : post.likesCount + 1,
            }
          : post,
      ),
    }))

    const postLikeApiUrl = `https://apis.ccbp.in/insta-share/posts/${postId}/like`
    const jwtToken = Cookies.get('jwt_token')

    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        like_status: !clickedPost.isLiked,
      }),
    }

    const response = await fetch(postLikeApiUrl, options)
  }

  renderUserStoriesSuccessView = () => {
    const {userStoriesList} = this.state

    const sliderSettings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 4,
          },
        },
      ],
    }

    return (
      <div className="sliderContainer">
        <Slider {...sliderSettings}>
          {userStoriesList.map(eachStory => (
            <div className="userStoryContainer" key={eachStory.userId}>
              <img
                src={eachStory.storyUrl}
                alt="user story"
                className="storyImage"
              />
              <p className="storyUsername">{eachStory.userName}</p>
            </div>
          ))}
        </Slider>
      </div>
    )
  }

  renderUserStoriesLoadingView = () => (
    <div className="user-story-loader-container" testid="loader">
      <Loader
        type="TailSpin"
        height={48}
        width={48}
        color="#4094EF"
        className="userStoryLoader"
      />
    </div>
  )

  renderFailureView = () => (
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
        onClick={this.onClickUserStoriesTryAgainBtn}
      >
        Try again
      </button>
    </div>
  )

  renderSearchEmptyView = () => (
    <div className="search-not-found-container">
      <img
        src="https://res.cloudinary.com/dcn7xe65r/image/upload/v1769790637/Group_rqegpw.png"
        alt="search not found"
        className="searchNotFoundImage"
      />
      <h1 className="searchNotFoundText">Search Not Found</h1>
      <p className="searchNotFoundDescription">
        Try different keyword or search again
      </p>
    </div>
  )

  renderSearchPostsLoadingView = () => (
    <div className="posts-loader-container" testid="loader">
      <Loader type="TailSpin" height={80} width={80} color="#4094EF" />
    </div>
  )

  renderSearchPostSuccessView = () => {
    const {postsList} = this.state

    if (postsList.length === 0) {
      return this.renderSearchEmptyView()
    }

    return (
      <>
        <h1 className="searchResultsText">Search Results</h1>
        <ul className="homePagePostsContainer">
          {postsList.map(eachPost => (
            <li key={eachPost.postId} className="homePagePostsListItem">
              <div className="postHeaderContainer">
                <div className="profileImageBackgroundContainer">
                  <img
                    src={eachPost.profilePic}
                    alt="post author profile"
                    className="postProfilePic"
                  />
                </div>
                <Link to={`/users/${eachPost.userId}`} className="nav-link">
                  <h1 className="postProfileUserName">{eachPost.userName}</h1>
                </Link>
              </div>
              <img src={eachPost.imageUrl} alt="post" className="postImage" />
              <div className="postTextContainer">
                <div className="postIconsContainer">
                  {eachPost.isLiked ? (
                    <button
                      type="button"
                      className="homePageLikeDislikeBtn"
                      value={eachPost.postId}
                      onClick={this.onClickLikeDislikeBtn}
                      testid="unLikeIcon"
                    >
                      <FcLike className="likeDislikeIcon" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="homePageLikeDislikeBtn"
                      value={eachPost.postId}
                      onClick={this.onClickLikeDislikeBtn}
                      testid="likeIcon"
                    >
                      <BsHeart className="likeDislikeIcon" />
                    </button>
                  )}

                  <FaRegComment className="postIcon" />
                  <BiShareAlt className="postIcon" />
                </div>
                <p className="postLikes">{eachPost.likesCount} likes</p>
                <p className="postCaption">{eachPost.caption}</p>
                <ul className="postCommentContainer">
                  {eachPost.comments.map(eachComment => (
                    <li
                      key={eachComment.userId}
                      className="postCommentListItem"
                    >
                      <p className="postComment">
                        <span>{eachComment.userName}</span>
                        {` ${eachComment.comment}`}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="postCreatedAt">{eachPost.createdAt}</p>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderSearchPostFailureView = () => (
    <div className="homePagePostsContainer">
      <div className="homePageSearchPostFailureContainer">
        <img
          src="https://res.cloudinary.com/dcn7xe65r/image/upload/v1769573861/Group_7522_xl2pn6.png"
          alt="failure view"
          className="myProfileSearchFailureViewImage"
        />
        <p className="homePostsFailureViewDescription">
          Something went wrong. Please try again
        </p>
        <button
          type="button"
          className="homeFailureTryAgainBtn"
          onClick={this.onClickSearchTryAgain}
        >
          Try again
        </button>
      </div>
    </div>
  )

  renderPostsSuccessView = () => {
    const {postsList} = this.state

    if (postsList.length === 0) {
      return this.renderSearchEmptyView()
    }

    return (
      <ul className="homePagePostsContainer">
        {postsList.map(eachPost => (
          <li key={eachPost.postId} className="homePagePostsListItem">
            <div className="postHeaderContainer">
              <div className="profileImageBackgroundContainer">
                <img
                  src={eachPost.profilePic}
                  alt="post author profile"
                  className="postProfilePic"
                />
              </div>
              <Link to={`/users/${eachPost.userId}`} className="nav-link">
                <h1 className="postProfileUserName">{eachPost.userName}</h1>
              </Link>
            </div>
            <img src={eachPost.imageUrl} alt="post" className="postImage" />
            <div className="postTextContainer">
              <div className="postIconsContainer">
                {eachPost.isLiked ? (
                  <button
                    type="button"
                    className="homePageLikeDislikeBtn"
                    value={eachPost.postId}
                    onClick={this.onClickLikeDislikeBtn}
                    testid="unLikeIcon"
                  >
                    <FcLike className="likeDislikeIcon" />
                  </button>
                ) : (
                  <button
                    type="button"
                    className="homePageLikeDislikeBtn"
                    value={eachPost.postId}
                    onClick={this.onClickLikeDislikeBtn}
                    testid="likeIcon"
                  >
                    <BsHeart className="likeDislikeIcon" />
                  </button>
                )}

                <FaRegComment className="postIcon" />
                <BiShareAlt className="postIcon" />
              </div>
              <p className="postLikes">{eachPost.likesCount} likes</p>
              <p className="postCaption">{eachPost.caption}</p>
              <ul className="postCommentContainer">
                {eachPost.comments.map(eachComment => (
                  <li key={eachComment.userId} className="postCommentListItem">
                    <p className="postComment">
                      <span>{eachComment.userName}</span>
                      {` ${eachComment.comment}`}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="postCreatedAt">{eachPost.createdAt}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderPostsLoadingView = () => (
    <div className="posts-loader-container" testid="loader">
      <Loader type="TailSpin" height={80} width={80} color="#4094EF" />
    </div>
  )

  renderPostsFailureView = () => (
    <div className="homePagePostsContainer">
      <div className="homePagePostFailureContainer">
        <img
          src="https://res.cloudinary.com/dcn7xe65r/image/upload/v1769320102/alert-triangle_emxcir.svg"
          alt="failure view"
          className="failureViewImage"
        />
        <p className="homePostsFailureViewDescription">
          Something went wrong. Please try again
        </p>
        <button
          type="button"
          className="homeFailureTryAgainBtn"
          onClick={this.onClickTryAgain}
        >
          Try again
        </button>
      </div>
    </div>
  )

  renderUserStoriesView = () => {
    const {userStoryApiStatus} = this.state

    switch (userStoryApiStatus) {
      case apiStatusConstants.success:
        return this.renderUserStoriesSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderUserStoriesLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  renderPostsView = () => {
    const {postsApiStatus} = this.state
    switch (postsApiStatus) {
      case apiStatusConstants.success:
        return this.renderPostsSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderPostsLoadingView()
      case apiStatusConstants.failure:
        return this.renderPostsFailureView()
      default:
        return null
    }
  }

  renderSearchResultsView = () => {
    const {searchApiStatus} = this.state
    switch (searchApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderSearchPostsLoadingView()
      case apiStatusConstants.success:
        return this.renderSearchPostSuccessView()
      case apiStatusConstants.failure:
        return this.renderSearchPostFailureView()
      default:
        return null
    }
  }

  render() {
    const {isSearchIconClicked, userStoryApiStatus} = this.state

    return (
      <>
        <Header
          showSearch
          onSearchPosts={this.getSearchedPosts}
          onResetPosts={this.getPosts}
        />
        {isSearchIconClicked ? (
          this.renderSearchResultsView()
        ) : (
          <>
            {this.renderUserStoriesView()}
            <>
              <hr className="mobileHomeHorizontalRule" />
              {this.renderPostsView()}
            </>
          </>
        )}
      </>
    )
  }
}

export default HomeRoute
