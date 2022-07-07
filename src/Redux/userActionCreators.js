import axios from "axios";
import * as actionTypes from './actionTypes';

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