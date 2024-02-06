import { useRedux } from '@/hooks/useRedux'
import { TPairBalances } from '@/types/global'
import {
  selectBalance,
  setBalances as set,
  removeBalances as remove,
  TInit
} from '@/features/trade/store/create-order'

type TReturn = {
  balance: TInit['balance']
  setBalances: (x: TPairBalances) => void
  removeBalances: () => void
}

export const useBalance = (): TReturn => {
  const [select, dispatch] = useRedux()

  const balance = select(selectBalance)
  const setBalances: TReturn['setBalances'] = (balances) => dispatch(set(balances))
  const removeBalances: TReturn['removeBalances'] = () => dispatch(remove())

  return { balance, setBalances, removeBalances }
}
