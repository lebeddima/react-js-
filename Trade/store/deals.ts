import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TSelector } from '@/store'
import { ELEMENTS_IN_DEELS } from '@/features/trade/constants/config'

export type TDeal = {
  id: number
  p: string
  pair: string
  q: string
  t: number
  v: string
  isBuy: boolean
}

export type TInit = {
  deals: TDeal[]
  isInit: boolean
}

export const init: TInit = {
  deals: [],
  isInit: true
}

const deals = createSlice({
  name: 'order-book',
  initialState: init,
  reducers: {
    setDeals(state, action: PayloadAction<TInit['deals']>) {
      if (state.isInit) {
        state.deals = action.payload
        state.isInit = false
        return
      }
      state.deals = [...action.payload, ...state.deals].splice(0, ELEMENTS_IN_DEELS)
    },
    setIsInit(state) {
      state.isInit = true
      state.deals = init.deals
    },
    reset: () => init
  }
})

export const { reset, setDeals, setIsInit } = deals.actions

// selectores
export const selectDeals: TSelector<TInit['deals']> = (state) => state.deals.deals

// reducer
export default deals.reducer
