import React, { Component } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { connect } from 'react-redux';
import Home from './Home/Home';
import Login from './Auth/Auth';
import Admin from '../Admin/Admin';
import { getUser } from '../../Redux/userActionCreators';
import Profile from './Profile/Profile';
import Verify from './Verify/Verify';

const mapStateToProps = (state) => {
  return ({
    user: state.user,
    userId: state.userId,
    userName: state.userName,
    userRole: state.userRole,
  })
}

const mapDispatchToProps = (dispatch) => {
  return ({
    getUser: () => dispatch(getUser()),
  })
}

class Body extends Component {
  componentDidMount() {
    this.props.getUser();
  }

  render() {
    let routes = null;

    if (this.props.userName !== null && this.props.userId !== null) {
      // if (this.props.userRole[0] === 'user') {
      //   routes = (
      //     <Routes>
      //       <Route path="/login" exact element={<Login />} />
      //       <Route path="/home" exact element={<Home />} />
      //       <Route path="/profile" exact element={<Profile />} />
      //       <Route
      //         path="*"
      //         element={<Navigate to="/home" replace={true} />}
      //       />
      //     </Routes>
      //   )
      // }
      if (this.props.userRole[1] === 'admin' && this.props.userRole[2] === 'verifier') {
        routes = (
          <Routes>
            <Route path="/admin" exact element={<Admin />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/profile" exact element={<Profile />} />
            <Route path="/verify" exact element={<Verify />} />
            <Route path="/home" exact element={<Home />} />
            <Route
              path="*"
              element={<Navigate to="/login" replace={true} />}
            />
          </Routes>
        )
      }
      else if (this.props.userRole[1] !== 'admin' && this.props.userRole[2] === 'verifier') {
        routes = (
          <Routes>
            <Route path="/login" exact element={<Login />} />
            {/* <Route path="/admin" exact element={<Admin />} /> */}
            <Route path="/home" exact element={<Home />} />
            <Route path="/profile" exact element={<Profile />} />
            <Route path="/verify" exact element={<Verify />} />
            <Route
              path="*"
              element={<Navigate to="/login" replace={true} />}
            />
          </Routes>
        )
      }
      else if (this.props.userRole[1] === 'admin' && this.props.userRole[2] !== 'verifier') {
        routes = (
          <Routes>
            <Route path="/login" exact element={<Login />} />
            <Route path="/admin" exact element={<Admin />} />
            <Route path="/home" exact element={<Home />} />
            <Route path="/profile" exact element={<Profile />} />
            <Route path="/verify" exact element={<Verify />} />
            <Route
              path="*"
              element={<Navigate to="/login" replace={true} />}
            />
          </Routes>
        )
      }
      else {
        routes = (
          <Routes>
            <Route path="/login" exact element={<Login />} />
            <Route path="/home" exact element={<Home />} />
            <Route path="/profile" exact element={<Profile />} />
            {/* <Route
              path="*"
              element={<Navigate to="/home" replace={true} />}
            /> */}
          </Routes>
        )
      }
    } else {
      routes = (
        <Routes>
          {/* <Route path="/home" exact element={<Home />} /> */}
          <Route path="/login" exact element={<Login />} />
        </Routes>)
    }

    return (
      <div>
        {routes}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Body);