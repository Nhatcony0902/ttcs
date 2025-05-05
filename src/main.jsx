
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import allReducers from './redux'

const store = configureStore({
  reducer: allReducers,

})

const root = ReactDOM.createRoot(document.getElementById('root'))

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
)
