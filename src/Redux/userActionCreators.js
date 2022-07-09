import axios from "axios";
import * as actionTypes from './actionTypes';

export const userRole = (role) => {
    // console.log(role);
    return ({
        type: actionTypes.USER_ROLE,
        payload: {
            role: role,
        }
    })
}

export const updateRole = (id, user) => {
    const URL = 'http://localhost:3001/Users/';

    const newRole = [...user.Role];
    // console.log(newRole);
    newRole.push("verifier");
    // console.log(newRole);

    axios.put(URL + id, {
        ...user,
        Role: newRole,
    })
        .then(resp => {
            // console.log(resp.data);
        }).catch(error => {
            console.log(error);
        });
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
        // if (found === 0) {
        //     console.log("User Not found");
        // }
    }
}

export const userInstitution = (institution) => {
    // console.log(institution);
    return {
        type: actionTypes.USER_INSTITUTION,
        payload: {
            institution: institution,
        }
    }
}

export const getInstitution = (users) => dispatch => {
    const userId = parseInt(localStorage.getItem('userId'));

    users.map((item) => {
        if (item.id === userId) {
            dispatch(userInstitution(item.Institution))
        }
    })
}

// reducer pathanor kaaj korbe
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
            dispatch(userInfo(response.data));
            dispatch(getInstitution(response.data));
        })
        .catch(error => console.log(error))
}