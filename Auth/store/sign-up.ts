import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TSelector, TAsyncAction } from '@/store'
import { TFormPropsAsync } from '@/types/formik'
import { ERROR_STATUS } from '@/constants/error-status'
import { userActions } from '@/containers/user'
import { handleActionErrors } from '@/utils/handle-action-errors'
import { Translate } from 'next-translate'
import { apiSignUp } from '../api/rest/sign-up'
import { EVerificationType, TSignUpReq } from '../api/rest/types'
import { apiOtp } from '../api/rest/otp'
import {
  ERROR_CODE_MANY_ATTEMPTS_MESSAGE,
  ERROR_CODE_MANY_ATTEMPTS_SECONDS,
} from '../constants'

export type TInit = {
  step: null | 'email-code' | 'email-code-error' | 'success'
  formSignUp: Partial<TSignUpReq>
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
  formSignUp: {},
  fetchingGlobal: false,
  code: {
    init: false,
    fetching: null,
    error: {},
  },
}

const signUp = createSlice({
  name: 'signUp',
  initialState: init,
  reducers: {
    setStep(state, action: PayloadAction<TInit['step']>) {
      state.step = action.payload
      state.code = init.code
    },
    setFormSignUp(state, action: PayloadAction<TInit['formSignUp']>) {
      state.formSignUp = action.payload
    },
    setFetchingGlobal(state, action: PayloadAction<TInit['fetchingGlobal']>) {
      state.fetchingGlobal = action.payload
    },
    // code
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
  setFormSignUp,
  setFetchingGlobal,
  setFetchingCode,
  setErrorCode,
  setInitCode,
} = signUp.actions

export const selectSignUp: TSelector<TInit> = (state) => state.signUp
export default signUp.reducer

// get code
export const getCode = (): TAsyncAction => async (dispatch) => {
  try {
    dispatch(setFetchingGlobal(true))
    await apiOtp.getCode({ type: EVerificationType.EMAIL_VERIFICATION })
    dispatch(setInitCode(true))
  } catch (e) {
    dispatch(setStep('email-code-error'))
  } finally {
    dispatch(setFetchingGlobal(false))
  }
}

// get code again
export const getCodeAgain = (): TAsyncAction => async (dispatch) => {
  try {
    dispatch(setFetchingCode('resend'))
    await apiOtp.getCode({ type: EVerificationType.EMAIL_VERIFICATION })
  } catch (e) {
    handleActionErrors({
      e,
      dispatch,
      additionalConditions: (status, data) => {
        if (status === ERROR_STATUS.MESSAGE) {
          dispatch(setErrorCode({ again: data.message }))
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
  async (dispatch) => {
    try {
      dispatch(setFetchingCode('code'))

      await apiOtp.sendCode({
        type: EVerificationType.EMAIL_VERIFICATION,
        code,
      })

      dispatch(setStep('success'))
    } catch (e) {
      dispatch(setFetchingCode(null))
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
                code: t(`sign-up:${ERROR_CODE_MANY_ATTEMPTS_MESSAGE}`, {
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

// send sign-up form
export const register =
  ({ formData, formik }: TFormPropsAsync<TSignUpReq>): TAsyncAction =>
  async (dispatch) => {
    try {
      const { data } = await apiSignUp.signUp(formData)
      dispatch(setFormSignUp({ ...formData, password: undefined }))
      dispatch(userActions.setUserData(data))

      if (!data.activationStatus?.emailActivated) {
        dispatch(setStep('email-code'))
        return
      }
    } catch (e) {
      handleActionErrors({ e, dispatch, formik })
    } finally {
      formik?.setSubmitting(false)
    }
  }
