export const STATE_SPLASH = 'STATE_SPLASH'
export const STATE_LOGGED = 'STATE_LOGGED'

export const stateSplash = (data) => dispatch => {
    dispatch({
        type: STATE_SPLASH,
        payload: data
    })
}

export const stateLogged = (token) => dispatch => {
    dispatch({
        type: STATE_LOGGED,
        payload: token
    })
}