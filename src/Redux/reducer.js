import * as actionTypes from "./actionTypes";

const INITIAL_STATE = {
    userId: null,
    userName: null,
    userInstitution: null,
    userRole: [],
    user: [],
    errorMsg: null,
    fileInfo: [],
    contractAddress: "0xb68239cD795Ca492Fa9b80Ccfa7301aD3feB2dde",
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
        case actionTypes.UPLOADED_FILE_INFO:
            return {
                ...state,
                fileInfo: action.payload.fileInfo,
            }
        default:
            return state;
    }
}