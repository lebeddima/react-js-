import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { TAsyncAction, TSelector } from '@/store'
import { TFormPropsAsync } from '@/types/formik'
import { handleActionErrors } from '@/utils/handle-action-errors'
import { apiCheckout } from '../api/rest'
import { TPromocode } from '../types'

export type TInit = {
  promocodeModal: boolean
  creditsModal: boolean
  creditsInUse: number
  promocode: TPromocode | null
}

const init: TInit = {
  promocodeModal: false,
  creditsModal: false,
  creditsInUse: 0,
  promocode: null,
}

const orderSummary = createSlice({
  name: 'orderSummary',
  initialState: init,
  reducers: {
    setPromocodeModal: (state, { payload }: PayloadAction<boolean>) => {
      state.promocodeModal = payload
    },
    setCreditsModal: (state, { payload }: PayloadAction<boolean>) => {
      state.creditsModal = payload
    },
    setCredits: (state, { payload }: PayloadAction<number>) => {
      state.creditsInUse = payload
    },
    setPromocode: (state, { payload }: PayloadAction<TPromocode>) => {
      state.promocode = payload
    },
    reset: () => init,
  },
})

export const {
  setPromocodeModal,
  setCreditsModal,
  setCredits,
  setPromocode,
  reset,
} = orderSummary.actions

export const selectOrderSummary: TSelector<TInit> = (state) => state.orderSummary

export const getPromocodeAsync =
  ({ formData, formik }: TFormPropsAsync<{ code: string }>): TAsyncAction =>
  async (dispatch, getState) => {
    try {
      const { dispensaryId } = getState().checkout
      if (!dispensaryId) return
      const res = await apiCheckout.getPromocode({ code: formData.code, dispensaryId })
      dispatch(setPromocode(res.data))
      dispatch(setPromocodeModal(false))
    } catch (e) {
      handleActionErrors({ e, dispatch, formik })
    } finally {
      formik.setSubmitting(false)
    }
  }

export default orderSummary.reducer
