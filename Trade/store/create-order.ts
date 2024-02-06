import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { TSelector, TAsyncAction } from '@/store'
import {
  TPairBalances,
  TCurrencyBalance,
  TOrderSide,
  TOrderType,
  TCurrency,
  TFees
} from '@/types/global'
import { TFields } from '@/features/trade/containers/create-order/FormLimit/types'
import { apiOrder } from '@/features/trade/api/rest/order'
import { apiWallet } from '@/features/trade/api/rest/wallet'
import { joinPair } from '@/utils/join-pair'
import { handleActionErrors } from '@/utils/handleActionErrors'
import { FormikOrder } from '@/features/trade/utils/formik-order'
import { selectPair } from '@/features/trade/store/pair'
import {
  QUANTITY_FIELD,
  PRICE_FIELD,
  TOTAL_FIELD
} from '@/features/trade/containers/create-order/constants'

export type TCurrencies = {
  mainCurrency: TCurrency | null
  baseCurrency: TCurrency | null
}

export type TInit = {
  fetching: boolean
  balances: TPairBalances | null
  balance: TCurrencyBalance | null
  side: TOrderSide
  orderType: TOrderType
  range: { percent: string[]; fromFields?: boolean }
  fees: TFees | null
  confirm: TFields | null
  success: boolean
}

export const init: TInit = {
  fetching: false,
  balances: null,
  balance: null,
  side: 'bid',
  orderType: 'market',
  range: { percent: ['0'], fromFields: false },
  fees: null,
  confirm: null,
  success: false
}

const createOrder = createSlice({
  name: 'create-order',
  initialState: init,
  reducers: {
    setFetching(state, action: PayloadAction<TInit['fetching']>) {
      state.fetching = action.payload
    },
    setBalances(state, action: PayloadAction<TPairBalances>) {
      state.balances = action.payload
      state.balance = state.side === 'bid' ? action.payload.base : action.payload.main
    },
    removeBalances(state) {
      state.balances = init.balances
      state.balance = init.balance
    },
    setSide(state, action: PayloadAction<TInit['side']>) {
      state.side = action.payload
      if (!state.balances) return
      state.balance = action.payload === 'bid' ? state.balances.base : state.balances.main
    },
    setOrderType(state, action: PayloadAction<TInit['orderType']>) {
      state.orderType = action.payload
    },
    setRange(state, action: PayloadAction<TInit['range']>) {
      state.range = action.payload
    },
    setFees(state, action: PayloadAction<TInit['fees']>) {
      state.fees = action.payload
    },
    setConfirm(state, action: PayloadAction<TInit['confirm']>) {
      state.confirm = action.payload
    },
    setSuccess(state, action: PayloadAction<TInit['success']>) {
      state.success = action.payload
    },

    reset: () => init
  }
})

export const {
  setFetching,
  setBalances,
  removeBalances,
  setSide,
  setOrderType,
  setRange,
  setFees,
  setConfirm,
  setSuccess
} = createOrder.actions

// selectores
export const selectFetching: TSelector<TInit['fetching']> = (state) =>
  state.createOrder.fetching
export const selectBalances: TSelector<TInit['balances']> = (state) =>
  state.createOrder.balances
export const selectBalance: TSelector<TInit['balance']> = (state) =>
  state.createOrder.balance
export const selectSide: TSelector<TInit['side']> = (state) => state.createOrder.side
export const selectOrderType: TSelector<TInit['orderType']> = (state) =>
  state.createOrder.orderType
export const selectCurrencies = createSelector(selectPair, (state) => ({
  mainCurrency: state ? state.mainCurrency : null,
  baseCurrency: state ? state.baseCurrency : null
}))
export const selectFees: TSelector<TInit['fees']> = (state) => state.createOrder.fees
export const selectFee = createSelector(
  [selectFees, selectOrderType],
  (stateFees, stateDirection) => {
    if (!stateFees) return '0'

    return stateDirection === 'limit' ? stateFees.maker : stateFees.taker
  }
)
export const selectConfirm: TSelector<TInit['confirm']> = (state) =>
  state.createOrder.confirm
export const selectSuccess: TSelector<TInit['success']> = (state) =>
  state.createOrder.success

export const selectRange: TSelector<TInit['range']> = (state) => state.createOrder.range

// reducer
export default createOrder.reducer

export const createAsync = (): TAsyncAction => async (dispatch, getState) => {
  const formik = FormikOrder.get()

  try {
    const { side, orderType, confirm: formData } = getState().createOrder
    const { pair } = getState().pairTrade

    if (!pair || !formData) return

    formik?.setSubmitting(true)
    dispatch(setConfirm(null))

    const pairName = {
      main: pair.mainCurrency.code,
      base: pair.baseCurrency.code
    }

    if (orderType === 'limit') {
      await apiOrder.createLimit({
        exchangePairId: pair?.id,
        side,
        [QUANTITY_FIELD]: formData[QUANTITY_FIELD],
        [PRICE_FIELD]: formData.rate || '0'
      })
    }

    if (orderType === 'market') {
      await apiOrder.createMarket({
        exchangePairId: pair?.id,
        side,
        [QUANTITY_FIELD]: formData[QUANTITY_FIELD] || undefined,
        [TOTAL_FIELD]: formData[TOTAL_FIELD] || undefined
      })
    }

    formik?.setSubmitting(false)
    formik?.resetForm()

    dispatch(setSuccess(true))

    const { data } = await apiWallet.pairBalance(joinPair({ pairName, separator: 'url' }))

    dispatch(setBalances(data))
  } catch (e) {
    handleActionErrors({ dispatch, e, formik })
  }
}

export const reset = (): TAsyncAction => async (dispatch) => {
  apiOrder.cancellation.createLimit()
  apiOrder.cancellation.createMarket()

  dispatch(createOrder.actions.reset())
}
