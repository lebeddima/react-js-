import { api } from '@/api/api'
import { TAxiosResponse } from '@/api/types'
import { TOrderSide } from '@/types/global'
import {
  QUANTITY_FIELD,
  PRICE_FIELD,
  TOTAL_FIELD
} from '@/features/trade/containers/create-order/constants'

let limitController: AbortController | null = null
let marketController: AbortController | null = null

export type TCreateLimitReq = {
  exchangePairId: number
  side: TOrderSide
  [QUANTITY_FIELD]: string
  [PRICE_FIELD]: string
}

export type TCreateMarketReq = {
  exchangePairId: number
  side: TOrderSide
  [QUANTITY_FIELD]?: string
  [TOTAL_FIELD]?: string
}

const createLimit = (data: TCreateLimitReq): TAxiosResponse<unknown> => {
  limitController?.abort()
  limitController = new AbortController()

  return api.post('order/create/limit', data, { signal: limitController.signal })
}

const createMarket = (data: TCreateMarketReq): TAxiosResponse<unknown> => {
  marketController?.abort()
  marketController = new AbortController()

  return api.post('order/create/market', data, { signal: marketController.signal })
}

export const apiOrder = {
  createLimit,
  createMarket,
  cancellation: {
    createLimit: (): void => limitController?.abort(),
    createMarket: (): void => marketController?.abort()
  }
}
