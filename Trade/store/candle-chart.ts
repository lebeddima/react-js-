import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TSelector, TAsyncAction } from '@/store'
import { TPairName } from '@/types/global'
import { apiCandleChart, TConfigResponse } from '@/features/trade/api/rest/candle-chart'
import { joinPair } from '@/utils/join-pair'
import { handleActionErrors } from '@/utils/handleActionErrors'

export type TInit = {
  pairName: TPairName
  intervals: TConfigResponse['intervals']
  priceScale: TConfigResponse['priceScale']
  currentInterval: TConfigResponse['intervals'][0]
  error: 'no-data' | 'error-load' | ''
  initLoading: boolean
  loading: boolean
}

export const init: TInit = {
  pairName: {
    main: '',
    base: ''
  },
  intervals: {} as TConfigResponse['intervals'],
  priceScale: {} as TConfigResponse['priceScale'],
  currentInterval: {} as TConfigResponse['intervals'][0],
  error: '',
  initLoading: true,
  loading: false
}

const candleChart = createSlice({
  name: 'candleChart',
  initialState: init,
  reducers: {
    setInterval(state, action: PayloadAction<TInit['currentInterval']>) {
      state.currentInterval = action.payload
    },
    setPair(
      state,
      action: PayloadAction<{ pairName: TPairName; config: TConfigResponse }>
    ) {
      const { pairName, config } = action.payload

      state.intervals = config.intervals
      state.priceScale = config.priceScale
      state.currentInterval =
        config.intervals.find(
          (interval) => interval.interval === config.defaultResolution
        ) || config.intervals[0]

      state.pairName = pairName
    },
    setPairName(state, action: PayloadAction<TInit['pairName']>) {
      state.pairName = action.payload
    },
    removePairName(state) {
      state.pairName = init.pairName
    },
    setError(state, action: PayloadAction<TInit['error']>) {
      state.error = action.payload
      state.initLoading = false
      state.loading = false
    },
    setInitLoading(state, action: PayloadAction<TInit['initLoading']>) {
      state.initLoading = action.payload
      state.error = ''
    },
    setLoading(state, action: PayloadAction<TInit['loading']>) {
      state.loading = action.payload
      state.error = ''
    },
    reset: () => init
  }
})

export const {
  setPair,
  setPairName,
  removePairName,
  setError,
  setInitLoading,
  setLoading,
  setInterval
} = candleChart.actions

// selectores
export const selectPairName: TSelector<TInit['pairName']> = (state) =>
  state.candleChart.pairName
export const selectIntervals: TSelector<TInit['intervals']> = (state) =>
  state.candleChart.intervals
export const selectInterval: TSelector<TInit['currentInterval']> = (state) =>
  state.candleChart.currentInterval
export const selectError: TSelector<TInit['error']> = (state) => state.candleChart.error
export const selectInitLoading: TSelector<TInit['initLoading']> = (state) =>
  state.candleChart.initLoading
export const selectLoading: TSelector<boolean> = (state) =>
  state.candleChart.initLoading || state.candleChart.loading

// reducer
export default candleChart.reducer

export const setPairData =
  (pairName: TPairName): TAsyncAction =>
  async (dispatch) => {
    try {
      const { data: config } = await apiCandleChart.chartConfig(
        joinPair({ pairName, separator: 'url' })
      )

      dispatch(setPair({ pairName, config }))
    } catch (e) {
      handleActionErrors({ dispatch, e })
    }
  }

export const reInit = (): TAsyncAction => async (dispatch, getState) => {
  const { pairName } = getState().candleChart

  dispatch(removePairName())
  setTimeout(() => {
    dispatch(setPairName(pairName))
  }, 50)
}

export const reset = (): TAsyncAction => async (dispatch) => {
  apiCandleChart.cancellation.chart()
  apiCandleChart.cancellation.config()

  dispatch(candleChart.actions.reset())
}
