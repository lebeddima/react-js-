import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TSelector, TAsyncAction } from '@/store'
import { TPair, TPairName } from '@/types/global'
import { apiExchangePair } from '@/requests/exchange-pair'
import { handleActionErrors } from '@/utils/handleActionErrors'

export type TInit = {
  init: boolean
  globalFetching: boolean
  pairs: TPair[]
  pairName: TPairName
}

export const init: TInit = {
  init: false,
  globalFetching: false,
  pairs: [],
  pairName: {
    main: '',
    base: ''
  }
}

const switchPairs = createSlice({
  name: 'switch-pairs',
  initialState: init,
  reducers: {
    setGlobalFetching(state, action: PayloadAction<TInit['globalFetching']>) {
      state.globalFetching = action.payload
    },
    setPairs(state, action: PayloadAction<TInit['pairs']>) {
      state.pairs = action.payload

      if (!state.init) {
        state.init = true
      }
    },
    setPairName(state, action: PayloadAction<TInit['pairName']>) {
      state.pairName = action.payload
    },

    reset: () => init
  }
})

export const { setPairs, setPairName, setGlobalFetching } = switchPairs.actions

// selectores
export const selectInit: TSelector<TInit['init']> = (state) => state.switchPairs.init
export const selectGlobalFetching: TSelector<TInit['globalFetching']> = (state) =>
  state.switchPairs.globalFetching
export const selectPairs: TSelector<TInit['pairs']> = (state) => state.switchPairs.pairs
export const selectPairName: TSelector<TInit['pairName']> = (state) =>
  state.switchPairs.pairName

// reducer
export default switchPairs.reducer

export const getPairs = (): TAsyncAction => async (dispatch, getState) => {
  try {
    const { data } = await apiExchangePair.pairList()

    const { pairName } = getState().switchPairs
    dispatch(setPairs(data))

    if (!pairName.main) {
      dispatch(
        setPairName({
          main: data[0].mainCurrency.code,
          base: data[0].baseCurrency.code
        })
      )
    }
  } catch (e) {
    handleActionErrors({ dispatch, e })
  }
}

export const reset = (): TAsyncAction => async (dispatch) => {
  apiExchangePair.cancellation.pairList()
  dispatch(switchPairs.actions.reset())
}
