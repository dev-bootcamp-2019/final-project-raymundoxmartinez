import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {reducer as formReducer} from 'redux-form';

import userReducer from './userReducer'

const reducer = combineReducers({
  routing: routerReducer,
  user: userReducer,
  form:formReducer,
})

export default reducer
