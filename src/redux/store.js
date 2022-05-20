import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import loginReducer from './reducers/loginReducer'
import generalReducer from './reducers/generalReducer'

const rootReducer = combineReducers({ loginReducer, generalReducer })

export const Store = createStore(rootReducer, applyMiddleware(thunk))