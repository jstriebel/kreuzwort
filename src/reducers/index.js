import { combineReducers } from "redux"

import cross from "./cross"

export default combineReducers({
  immutable: cross,
})
