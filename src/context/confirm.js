import React, { useReducer } from 'react'

const initialState = { open: false }

export const ConfirmDispatchContext = React.createContext(null)
export const ConfirmStateContext = React.createContext(initialState)

const RESET = 'RESET'
const SET_MESSAGE = 'SET_MESSAGE'
const SET_ON_CONFIRM = 'SET_ON_CONFIRM'
const SET_ON_CANCEL = 'SET_ON_CANCEL'
const SET_TITLE = 'SET_TITLE'
const TOGGLE_DIALOG = 'TOGGLE_DIALOG'

export const confirm = function({ message, title }, dispatch, { open }) {
  // return a promise that resolves or rejects after user interaction
  return new Promise((resolve, reject) => {
    // set custom options
    dispatch({ type: SET_MESSAGE, payload: message })
    dispatch({ type: SET_TITLE, payload: title })

    // on confirm, resolve the promise and reset confirmation state
    dispatch({
      type: SET_ON_CONFIRM,
      payload: () => {
        resolve()
        dispatch({ type: RESET })
      }
    })

    // on cancel, reject the promise and reset confirmation state
    dispatch({
      type: SET_ON_CANCEL,
      payload: () => {
        const error = new Error('The confirmation dialog was cancelled')
        error.warning = true
        reject(error)
        dispatch({ type: RESET })
      }
    })

    // open custom dialog
    dispatch({ type: TOGGLE_DIALOG, payload: true })
  })
}

function reducer(state, action) {
  switch (action.type) {
    case RESET:
      return { open: false }
    case SET_MESSAGE:
      return { ...state, message: action.payload }
    case SET_TITLE:
      return { ...state, title: action.payload }
    case SET_ON_CONFIRM:
      return { ...state, onConfirm: action.payload }
    case SET_ON_CANCEL:
      return { ...state, onCancel: action.payload }
    case TOGGLE_DIALOG:
      return { ...state, open: action.payload }
    default:
      console.log(`${action.type} is not a valid action`)
      return { ...state }
  }
}

export function ConfirmProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <ConfirmDispatchContext.Provider value={dispatch}>
      <ConfirmStateContext.Provider value={state}>
        {children}
      </ConfirmStateContext.Provider>
    </ConfirmDispatchContext.Provider>
  )
}
