import { LocaleProvider } from "antd"
import de_DE from "antd/lib/locale-provider/de_DE"
import { isCollection } from "immutable"
import moment from "moment"
import "moment/locale/de"
import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"
import { createStore } from "redux"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { PersistGate } from "redux-persist/integration/react"
import immutableTransform from "redux-persist-transform-immutable"

import "./index.css"
import App from "./App"
import registerServiceWorker from "./registerServiceWorker"
import reducer from "./reducers"

function immutableReconciler<State: Object>(
  inboundState: State,
  originalState: State,
  reducedState: State
): State {
  if (!isCollection(reducedState.immutable)) return inboundState
  return {
    ...inboundState,
    immutable: reducedState.immutable.merge(inboundState.immutable),
  }
}

const persistConfig = {
  transforms: [immutableTransform()],
  key: "root",
  storage,
  stateReconciler: immutableReconciler,
}

const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(
  persistedReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

const persistor = persistStore(store)

moment.locale("de")

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <LocaleProvider locale={de_DE}>
        <App />
      </LocaleProvider>
    </PersistGate>
  </Provider>,
  document.getElementById("app")
)
registerServiceWorker()
