import React, { Component } from 'react';
import Header from './Header/Header';
import Body from './Body/Body';
import Footer from './Footer/Footer';
import { authCheck } from '../Redux/authActionCreator';
import { connect } from 'react-redux';
import { getUser, getRole} from '../Redux/userActionCreators';

const mapStateToProps = (state) => {
    return({
        user: state.user,
        userId: state.userId,
        userName: state.userName,
    })
}

const mapDispatchToProps = (dispatch) => {
    return ({
        authCheck: () => dispatch(authCheck()),
        getUser: () => dispatch(getUser()),
        getRole: (users, userId, userName) => dispatch(getRole(users, userId, userName)),
    })
}

class Main extends Component {
    componentDidMount() {
        this.props.authCheck(); //previous authenticity
        this.props.getUser();
    }

    render() {
        this.props.getRole(this.props.user, this.props.userId, this.props.userName);

        return (
            <div>
                <Header />
                <Body />
                {/* <Footer/> */}
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
