import React, { Component } from 'react';
import Header from './Header/Header';
import Body from './Body/Body';
import Footer from './Footer/Footer';
import { authCheck } from '../Redux/authActionCreator';
import { connect } from 'react-redux';
import { userInfo } from '../Redux/userActionCreators';

const mapDispatchToProps = (dispatch) => {
    return ({
        authCheck: () => dispatch(authCheck()),
    })
}

class Main extends Component {
    componentDidMount() {
        this.props.authCheck();
    }

    render() {
        return (
            <div>
                <Header />
                <Body />
                {/* <Footer/> */}
            </div>
        )
    }
}

export default connect(null, mapDispatchToProps)(Main);
