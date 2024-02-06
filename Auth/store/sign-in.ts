import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TFormPropsAsync } from '@/types/formik'
import { TSelector, TAsyncAction } from '@/store'
import { FormikHelpers } from 'formik'
import { handleActionErrors } from '@/utils/handle-action-errors'
import { userActions } from '@/containers/user'
import { apiSignIn } from '../api/rest/sign-in'
import { TLoginReq } from '../api/rest/types'

export type TInit = {
  step: null | 'incomplete-registration'
  formSignIn: Partial<TLoginReq>
}

export const init: TInit = {
  step: null,
  formSignIn: {},
}

const signIn = createSlice({
  name: 'signIn',
  initialState: init,
  reducers: {
    setStep(state, action: PayloadAction<TInit['step']>) {
      state.step = action.payload
    },
    setFormSignIn(state, action: PayloadAction<TInit['formSignIn']>) {
      state.formSignIn = action.payload
    },
    reset: () => init,
  },
})

export const { reset, setStep, setFormSignIn } = signIn.actions
export const selectSignIn: TSelector<TInit> = (state) => state.signIn
export default signIn.reducer

// send sign-in form
export const signInAsync =
  ({
    formData,
    formik,
  }: Omit<TFormPropsAsync<TLoginReq>, 'formik'> & {
    formik?: FormikHelpers<TLoginReq>
  }): TAsyncAction =>
  async (dispatch) => {
    try {
      const { data } = await apiSignIn.login(formData)

      dispatch(userActions.setUserData(data))

      if (data.activationStatus && !data.activationStatus.emailActivated) {
        dispatch(setFormSignIn({ email: formData.email }))
        dispatch(setStep('incomplete-registration'))

        return
      }
    } catch (e) {
      handleActionErrors({
        e,
        dispatch,
        formik,
      })
    } finally {
      formik?.setSubmitting(false)
    }
  }
