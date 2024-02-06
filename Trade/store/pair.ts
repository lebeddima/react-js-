import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'
import { TSelector, TRootState } from '@/store'
import { TPair, TPairName } from '@/types/global'
import { joinPair } from '@/utils/join-pair'
import { TResponse as TResponseSocket } from '@/features/trade/api/socket/pair'

export type TInit = {
  pair: TPair | null
  pairName: TPairName
  pairString: string
  isFavorite: boolean
}

export const init: TInit = {
  pair: null,
  pairName: {
    main: '',
    base: ''
  },
  pairString: '',
  isFavorite: false
}

const pairTrade = createSlice({
  name: 'pairTrade',
  initialState: init,
  reducers: {
    setPair(state, action: PayloadAction<TPair>) {
      state.pair = action.payload

      state.pairName = {
        main: action.payload?.mainCurrency.code || '',
        base: action.payload?.baseCurrency.code || ''
      }
      state.isFavorite = action.payload.isFavourite
    },
    setPairName(state, action: PayloadAction<TInit['pairName']>) {
      const pairName = action.payload
      state.pairName = pairName
      state.pairString = joinPair({ pairName, separator: 'url' })
    },
    setFavorite(state, action: PayloadAction<boolean>) {
      state.isFavorite = action.payload
    },
    setPairSocket(state, action: PayloadAction<TResponseSocket>) {
      if (!state.pair) return
      state.pair = {
        ...state.pair,
        ...action.payload
      }
    },

    reset: () => init
  }
})

export const { setPair, setPairName, setFavorite, setPairSocket, reset } =
  pairTrade.actions

// selectores
export const selectPair: TSelector<TInit['pair']> = (state) => state.pairTrade.pair
export const selectPairName: TSelector<TInit['pairName']> = (state) =>
  state.pairTrade.pairName
export const selectPairString: TSelector<TInit['pairString']> = (state) =>
  state.pairTrade.pairString
export const selectFavorite = createSelector(
  [selectPairName, (state: TRootState) => state.pairTrade.isFavorite],
  (pairName, isFavorite) => ({
    isFavorite,
    main: pairName.main,
    base: pairName.base
  })
)

// reducer
export default pairTrade.reducer
