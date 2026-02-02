import {Switch, Route} from 'react-router-dom'
import LoginRoute from './components/LoginRoute'
import ProtectedRoute from './components/ProtectedRoute'
import HomeRoute from './components/HomeRoute'
import MyProfileRoute from './components/MyProfileRoute'
import UserProfileRoute from './components/UserProfileRoute'
import NotFoundRoute from './components/NotFoundRoute'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginRoute} />
    <ProtectedRoute exact path="/" component={HomeRoute} />
    <ProtectedRoute exact path="/my-profile" component={MyProfileRoute} />
    <ProtectedRoute exact path="/users/:id" component={UserProfileRoute} />
    <NotFoundRoute />
  </Switch>
)

export default App
