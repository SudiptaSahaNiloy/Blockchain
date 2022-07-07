import axios from "axios";
import * as actionTypes from './actionTypes';

export const userRole = (role) => {
    return({
        type: actionTypes.USER_ROLE,
        payload: {
            role: role,
        }
    })
}

export const getRole = (user, userId, userName) => dispatch => {
    if (user !== undefined) {
        let found = 0;
        user.map((item) => {
            if (item.id === parseInt(userId) && item.Name === userName) {
                found = 1;
                dispatch(userRole(item.Role));
            }
        })
        if (found === 0) {
            console.log("User Not found");
        }
    }

    // let role = {
    //     admin: false,
    //     verifier: false,
    // }

    // userRole.map((item) => {
    //     if (item === 'admin') {
    //         // console.log("found admin");
    //         role.admin = true;
    //     }
    //     if (item === 'verifier') {
    //         // console.log("found verifier");
    //         role.verifier = true;
    //     }
    // })
}

export const userInfo = (user) => {
    return ({
        type: actionTypes.GET_USER,
        payload: {
            user: user,
        }
    })
}

export const getUser = () => dispatch => {
    const URL = 'http://localhost:3001/Users';
    axios.get(URL)
        .then(response => {
            dispatch(userInfo(response.data))
        })
}