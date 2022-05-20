export const SET_DATA_SITES = 'SET_DATA_SITES'
export const SET_DATA_USER = 'SET_DATA_USER'

export const setDataSites = (data) => dispatch => {
    dispatch({
        type: SET_DATA_SITES,
        payload: data
    })
}

export const setDataUser = (data) => dispatch => {
    dispatch({
        type: SET_DATA_USER,
        payload: data
    })
}