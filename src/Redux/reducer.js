import * as actionTypes from "./actionTypes";

const INITIAL_STATE = {
    userId: null,
    userName: null,
    userInstitution: null,
    users: [],
}

export const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.AUTH_SUCCESS:
            return {
                ...state,
                customerName: action.payload.customerName,
            }
        case actionTypes.AUTH_FAILED:
            return {
                ...state,
                errorMsg: action.payload,
            }
        case actionTypes.AUTH_LOGOUT:
            return {
                ...state,
                displayName: null,
            }
        default:
            return state;
    }
}