import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TSelector, TAsyncAction } from '@/store'
import { Translate } from 'next-translate'
import { TFormPropsAsync } from '@/types/formik'
import { ERROR_STATUS } from '@/constants/error-status'
import { handleActionErrors } from '@/utils/handle-action-errors'
import { TForgotCodeReq, TForgotEmailReq, TForgotPass } from '../api/rest/types'
import { apiFotgotPass } from '../api/rest/forgot-pass'
import {
  ERROR_CODE_MANY_ATTEMPTS_MESSAGE,
  ERROR_CODE_MANY_ATTEMPTS_SECONDS,
} from '../constants'

export type TInit = {
  step: null | 'email-code' | 'email-code-error' | 'password' | 'success'
  form: Partial<TForgotCodeReq>
  fetchingGlobal: boolean
  code: {
    init: boolean
    fetching: null | 'code' | 'resend'
    error: {
      code?: string
      again?: string
    }
  }
}

const init: TInit = {
  step: null,
  form: {},
  fetchingGlobal: false,
  code: {
    init: false,
    fetching: null,
    error: {},
  },
}

const forgotPass = createSlice({
  name: 'forgotPass',
  initialState: init,
  reducers: {
    setStep(state, action: PayloadAction<TInit['step']>) {
      state.step = action.payload
      state.code = init.code
    },
    setForm(state, action: PayloadAction<TInit['form']>) {
      state.form = action.payload
    },
    setFetchingGlobal(state, action: PayloadAction<TInit['fetchingGlobal']>) {
      state.fetchingGlobal = action.payload
    },
    setFetchingCode(state, action: PayloadAction<TInit['code']['fetching']>) {
      state.code.fetching = action.payload
    },
    setInitCode(state, action: PayloadAction<TInit['code']['init']>) {
      state.code.init = action.payload
    },
    setErrorCode(state, action: PayloadAction<Partial<TInit['code']['error']>>) {
      state.code.error = { ...state.code.error, ...action.payload }
    },
    reset: () => init,
  },
})

export const {
  reset,
  setStep,
  setForm,
  setFetchingGlobal,
  setFetchingCode,
  setErrorCode,
  setInitCode,
} = forgotPass.actions

export const selectForgot: TSelector<TInit> = (state) => state.forgotPass
export default forgotPass.reducer

// validate email
export const validateEmai =
  ({ formData, formik }: TFormPropsAsync<TForgotEmailReq>): TAsyncAction =>
  async (dispatch) => {
    try {
      await apiFotgotPass.validateEmail(formData)
      dispatch(setForm(formData))
      dispatch(setStep('email-code'))
    } catch (e) {
      handleActionErrors({
        e,
        dispatch,
        formik,
        additionalConditions: (status, data) => {
          if (status === ERROR_STATUS.MANY_REQUESTS) {
            formik.setErrors({ email: data.message })
            return true
          }
        },
      })
    } finally {
      formik?.setSubmitting(false)
    }
  }

// get code
export const getCode = (): TAsyncAction => async (dispatch, useState) => {
  try {
    const { email } = useState().forgotPass.form
    dispatch(setFetchingGlobal(true))
    await apiFotgotPass.getCode({ email: email || '' })
    dispatch(setInitCode(true))
  } catch (e) {
    dispatch(setStep('email-code-error'))
  } finally {
    dispatch(setFetchingGlobal(false))
  }
}

// get code again
export const getCodeAgain =
  (t: Translate): TAsyncAction =>
  async (dispatch, useState) => {
    try {
      const { email } = useState().forgotPass.form
      dispatch(setFetchingCode('resend'))
      await apiFotgotPass.getCode({ email: email || '' })
    } catch (e) {
      handleActionErrors({
        e,
        dispatch,
        additionalConditions: (status) => {
          if (status === ERROR_STATUS.MANY_REQUESTS) {
            dispatch(
              setErrorCode({
                again: t(`forgot-pass:${ERROR_CODE_MANY_ATTEMPTS_MESSAGE}`, {
                  seconds: ERROR_CODE_MANY_ATTEMPTS_SECONDS,
                }),
              }),
            )
            return true
          }
        },
      })
    } finally {
      dispatch(setFetchingCode(null))
    }
  }

// send code
export const sendCode =
  (code: string, t: Translate): TAsyncAction =>
  async (dispatch, useState) => {
    try {
      const { email } = useState().forgotPass.form
      dispatch(setFetchingCode('code'))
      await apiFotgotPass.sendCode({
        email: email || '',
        code,
      })
      dispatch(setForm({ email, code }))
      dispatch(setStep('password'))
    } catch (e) {
      handleActionErrors({
        e,
        dispatch,
        additionalConditions: (status, data) => {
          if (status === ERROR_STATUS.MESSAGE || status === ERROR_STATUS.VALIDATION) {
            dispatch(setErrorCode({ code: data.message }))
            return true
          }
          if (status === ERROR_STATUS.MANY_REQUESTS) {
            dispatch(
              setErrorCode({
                code: t(`forgot-pass:${ERROR_CODE_MANY_ATTEMPTS_MESSAGE}`, {
                  seconds: ERROR_CODE_MANY_ATTEMPTS_SECONDS,
                }),
              }),
            )
            return true
          }
        },
      })
    } finally {
      dispatch(setFetchingCode(null))
    }
  }

// send new password
export const sendPass =
  ({ formData, formik }: TFormPropsAsync<TForgotPass>): TAsyncAction =>
  async (dispatch, useState) => {
    try {
      const { email, code } = useState().forgotPass.form
      dispatch(setFetchingCode('code'))
      await apiFotgotPass.sendPassword({
        ...formData,
        email: email || '',
        code: code || '',
      })

      dispatch(setStep('success'))
    } catch (e) {
      handleActionErrors({ e, formik, dispatch })
    } finally {
      formik?.setSubmitting(false)
    }
  }
