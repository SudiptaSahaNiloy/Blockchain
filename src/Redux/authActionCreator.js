import axios from "axios";
import * as actionTypes from "./actionTypes.js";

export const authSuccess = (customerName) => {
    // console.log(customerName);
    return ({
        type: actionTypes.AUTH_SUCCESS,
        payload: {
            customerName: customerName,
        },
    })
}

export const authLogout = () => {
    localStorage.removeItem('CustomerName');
    localStorage.removeItem('CustomerId');
    return ({ type: actionTypes.AUTH_LOGOUT });
}

export const authFailed = (errMsg) => {
    return {
        type: actionTypes.AUTH_FAILED,
        payload: errMsg,
    }
}

export const auth = (email, password) => dispatch => {
    const URL = 'http://localhost:3001/Customer';

    axios.get(URL)
        .then(response => {
            response.data.map((item, id) => {
                if (item.Email === email && item.Password === password) {
                    localStorage.setItem('CustomerId', response.data[id].id);
                    localStorage.setItem('CustomerName', response.data[id].Name);
                    dispatch(authSuccess(response.data[id].Name));
                } else {
                    dispatch(authFailed("Incorrect Email or Password. Try Again"));
                    setTimeout(() => {
                        dispatch(authFailed(null));
                    }, 4000);
                }
            })
        })
}

// remember me section. Used to stay logged in
export const authCheck = () => dispatch => {
    const userName = localStorage.getItem('CustomerName');
    if (userName === null) {
        // logout
        dispatch(authLogout());
    } else {
        dispatch(authSuccess(userName));
    }
}

// const displayName = (userName) => {
//     return {
//         type: actionTypes.LOAD_USER_DATA,
//         payload: userName,
//     }
// }


export const userData = (values) => dispatch => {
    let firstName = values.firstName;
    let lastName = values.lastName;
    const fullName = firstName + " " + lastName;

    const userData = {
        Name: fullName,
        Email: values.email,
        Password: values.password,
        CurrentAddress: values.currentAddress,
        NID: values.NID,
    }

    const URL = 'http://localhost:3001/Customer';
    axios.post(URL, userData)
        .then(response => {
            dispatch(authSuccess(userData.Name))
        })
}


