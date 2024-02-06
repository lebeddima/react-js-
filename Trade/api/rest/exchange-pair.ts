import { api } from '@/api/api'
import { TAxiosResponse } from '@/api/types'
import { TPair } from '@/types/global'

let pairController: AbortController | null = null

const pair = (pair: string): TAxiosResponse<TPair> => {
  pairController?.abort()
  pairController = new AbortController()

  return api.get(`exchange-pair/${pair}`, { signal: pairController.signal })
}

export const apiExchangePair = {
  pair,
  cancellation: {
    pair: (): void => pairController?.abort()
  }
}
