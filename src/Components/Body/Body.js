import React, { Component } from 'react';
import { Route, Routes } from 'react-router';
import { connect } from 'react-redux';
import Home from './Home/Home';
import Login from './Auth/Auth';
import Admin from '../Admin/Admin';
import { getUser } from '../../Redux/userActionCreators'

const mapStateToProps = (state) => {
  return ({
    user: state.user,
    userId: state.userId,
    userName: state.userName,
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
    let userRole = [];

    if (this.props.user !== undefined) {
      let found = 0;
      this.props.user.map((item) => {
        if (item.id === parseInt(this.props.userId) && item.Name === this.props.userName) {
          found = 1;
          userRole = item.Role;
        }
      })
      if (found === 0) {
        console.log("User Not found");
      }
    }

    let admin = false;
    let verifier = false;

    userRole.map((item) => {
      if (item === 'admin') {
        // console.log("found admin");
        admin = true;
      }
      if (item === 'verifier') {
        // console.log("found verifier");
        verifier = true;
      }
    })

    if (this.props.userName !== null && this.props.userId !== null) {
      console.log(admin);
      if (admin) {
        routes = (
          <Routes>
            <Route path="/admin" exact element={<Admin />} />
            <Route path="/login" exact element={<Login />} />
            <Route path="/home" exact element={<Home />} />
          </Routes>
        )
      }
      else if (verifier === true) {
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
    }

    return (
      <div>
        {routes}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Body);