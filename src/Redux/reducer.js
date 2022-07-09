import * as actionTypes from "./actionTypes";

const INITIAL_STATE = {
    userId: null,
    userName: null,
    userInstitution: null,
    userRole: [],
    user: [],
    errorMsg: null,
}

export const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes.AUTH_SUCCESS:
            return {
                ...state,
                userId: action.payload.userId,
                userName: action.payload.userName,
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
        case actionTypes.GET_USER:
            return {
                ...state,
                user: action.payload.user,
            }
        case actionTypes.USER_ROLE:
            return {
                ...state,
                userRole: action.payload.role,
            }
        case actionTypes.USER_INSTITUTION:
            return {
                ...state,
                userInstitution: action.payload.institution,
            }
        default:
            return state;
    }
}