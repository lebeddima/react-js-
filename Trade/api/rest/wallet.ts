import { api } from '@/api/api'
import { TAxiosResponse } from '@/api/types'
import { TPairBalances } from '@/types/global'

let pairBalanceController: AbortController | null = null

const pairBalance = (pair: string): TAxiosResponse<TPairBalances> => {
  pairBalanceController?.abort()
  pairBalanceController = new AbortController()

  return api.get(`wallet/balance/${pair}`, { signal: pairBalanceController.signal })
}

export const apiWallet = {
  pairBalance,
  cancellation: {
    pairBalance: (): void => pairBalanceController?.abort()
  }
}
