import React, { Component } from 'react';
import { Route, Routes } from 'react-router';
import { connect } from 'react-redux';
import Home from './Home/Home';
import Login from './Auth/Auth';
import Admin from '../Admin/Admin';
import { getUser } from '../../Redux/userActionCreators';

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

    console.log(this.props.userRole);

    if (this.props.userName !== null && this.props.userId !== null) {
      if (this.props.userRole[1] === 'admin') {
        routes = (
          <Routes>
            <Route path="/admin" exact element={<Admin />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/home" exact element={<Home />} />
          </Routes>
        )
      }
      else if (this.props.userRole[1] === 'verifier') {
        routes = (
          <Routes>
            <Route path="/login" exact element={<Login />} />
            <Route path="/home" exact element={<Home />} />
          </Routes>
        )
      }
      else {
        routes = (
          <Routes>
            <Route path="/login" exact element={<Login />} />
            <Route path="/home" exact element={<Home />} />
          </Routes>
        )
      }
    } else {
      routes = (
        <Routes>
          <Route path="/login" exact element={<Login />} />
        </Routes>
      )
    }

    return (
      <div>
        {routes}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Body);