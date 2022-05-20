import { STATE_SPLASH, STATE_LOGGED } from "../actions/loginAction";

export const initialState = {
    splash: true,
    token: null
}

export default function loginReducer(state = initialState, action) {
    switch(action.type){
        case STATE_SPLASH:
            return {...state, splash: action.payload}
        case STATE_LOGGED:
            return {...state, token: action.payload}
        default: return state
    }
}