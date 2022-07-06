import React, { Component } from 'react';
import { Route, Routes } from 'react-router';
import Home from './Home/Home';
import Login from './Auth/Auth'

class Body extends Component {
  render() {
    let routes = null;

    routes = (
      <Routes>
        <Route path="/login" exact element={<Login />} />
        <Route path="/home" exact element={<Home />} />
      </Routes>
    )

    console.log(routes);

    return (
      <div>
        {routes}
      </div>
    )
  }
}

export default Body