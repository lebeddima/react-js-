import axios from 'axios'
import { TStore } from '@/store'
import { apiCandleChart } from '@/features/trade/api/rest/candle-chart'
import { joinPair } from '@/utils/join-pair'
import {
  LibrarySymbolInfo,
  IDatafeedChartApi,
  IExternalDatafeed,
  HistoryCallback
} from '@/features/trade/types/tradeview'
import {
  setError,
  setLoading,
  setInitLoading,
  reInit
} from '@/features/trade/store/candle-chart'
import { createEventName, candleSocket } from '@/features/trade/api/socket/candle'
import { intervalTransform } from './interval-transform'
import { getTimeZone } from './time-zone'

let store = {} as TStore

export const injectStoreTradeFeed = (_store: TStore) => {
  store = _store
}

const EVENT_ID = 'candle-chart'
let eventName = ''

const getSupportedResolutions = () => {
  const { intervals } = store.getState().candleChart
  return intervals.map((item) => intervalTransform(item.interval))
}

const getPriceScale = () => {
  const { priceScale } = store.getState().candleChart

  return Number(`1${''.padStart(priceScale, '0')}`)
}

export const datafeed: IDatafeedChartApi & IExternalDatafeed = {
  onReady: (callback) => {
    const supported_resolutions = getSupportedResolutions()
    setTimeout(() => callback({ supported_resolutions }))
  },

  searchSymbols: () => {
    //
  },

  resolveSymbol: async (symbolName, onSymbolResolvedCallback) => {
    const symbolInfo: LibrarySymbolInfo = {
      name: symbolName,
      full_name: symbolName,
      description: symbolName,
      type: 'crypto',
      session: '24x7',
      exchange: 'Trade',
      timezone: getTimeZone(),
      format: 'price',
      has_intraday: true,
      has_no_volume: false,
      has_weekly_and_monthly: true,
      minmov: 1,
      has_empty_bars: true,
      pricescale: getPriceScale(),
      volume_precision: 4,
      listed_exchange: '',
      supported_resolutions: getSupportedResolutions()
    }

    setTimeout(() => {
      onSymbolResolvedCallback(symbolInfo)
    }, 0)
  },

  getBars: async (
    _,
    __,
    ___,
    to: number,
    onHistoryCallback: HistoryCallback,
    ____,
    firstDataRequest: boolean
  ) => {
    const { currentInterval } = store.getState().candleChart

    try {
      if (firstDataRequest) {
        store.dispatch(setInitLoading(true))
      } else store.dispatch(setLoading(true))

      const { data } = await apiCandleChart.chart({
        pair: joinPair({
          pairName: store.getState().candleChart.pairName,
          separator: 'url'
        }),
        params: {
          limit: currentInterval.limit,
          timeEnd: to,
          interval: currentInterval.interval
        }
      })

      store.dispatch(setLoading(false))
      store.dispatch(setInitLoading(false))

      let bars = data

      if (firstDataRequest && bars.length === 0) {
        store.dispatch(setError('no-data'))
      }

      if (bars.length === 0) {
        onHistoryCallback([], { noData: true })
        return
      }

      onHistoryCallback(bars, { noData: false })
    } catch (e) {
      if (axios.isCancel(e)) {
        return
      }

      console.error(e)
      store.dispatch(setError('error-load'))
      onHistoryCallback([], { noData: false })
    }
  },

  subscribeBars: (_, __, onSetBar) => {
    const { pairName, currentInterval } = store.getState().candleChart

    eventName = createEventName({
      pair: joinPair({ pairName, separator: 'url' }),
      interval: currentInterval.interval
    })

    candleSocket.subscribe({
      id: EVENT_ID,
      event: eventName,
      onResponse: (data) => {
        onSetBar(data.tempKindle)
      },
      onReconnect: () => store.dispatch(reInit())
    })
  },

  unsubscribeBars: () => {
    candleSocket.unsubscribe({
      id: EVENT_ID,
      event: eventName
    })
    eventName = ''
  }
}
