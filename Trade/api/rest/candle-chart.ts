import { api } from '@/api/api'
import { TAxiosResponse } from '@/api/types'
import { Bar } from '@/features/trade/types/tradeview'

type TChartRequest = {
  pair: string
  params: {
    limit: number
    timeEnd: number
    interval: string
  }
}

export type TIntervals = {
  id: number
  interval: string
  limit: number
}[]

export type TConfigResponse = {
  intervals: TIntervals
  defaultResolution: TIntervals[0]['interval']
  priceScale: number
}

let chartController: AbortController | null = null
let сonfigController: AbortController | null = null

const chart = ({ pair, params }: TChartRequest): TAxiosResponse<Bar[]> => {
  chartController?.abort()
  chartController = new AbortController()

  return api.get(`chart/${pair}`, { params, signal: chartController.signal })
}

const chartConfig = (pair: string): TAxiosResponse<TConfigResponse> => {
  сonfigController?.abort()
  сonfigController = new AbortController()

  return api.get(`exchange-pair/kgraph/${pair}`, { signal: сonfigController.signal })
}

export const apiCandleChart = {
  chart,
  chartConfig,
  cancellation: {
    chart: (): void => chartController?.abort(),
    config: (): void => chartController?.abort()
  }
}
