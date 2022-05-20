import { SET_DATA_SITES, SET_DATA_USER } from "../actions/generalAction";

export const initialState = {
    dataSites: [],
    dataUser: {}
}

export default function generalReducer(state = initialState, action) {
    switch(action.type){
        case SET_DATA_SITES:
            return {...state, dataSites: action.payload}
        case SET_DATA_USER:
            return {...state, dataUser: action.payload}
        default: return state
    }
}