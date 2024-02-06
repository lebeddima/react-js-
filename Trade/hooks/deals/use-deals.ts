import { useRedux } from '@/hooks/useRedux'
import { selectDeals, setDeals, setIsInit, TInit } from '@/features/trade/store/deals'

type TReturn = {
  deals: TInit['deals']
  setDeals: (x: TInit['deals']) => void
  setIsInit: () => void
}

export const useDeals = (): TReturn => {
  const [select, dispatch] = useRedux()

  return {
    deals: select(selectDeals),
    setDeals: (x) => dispatch(setDeals(x)),
    setIsInit: () => dispatch(setIsInit())
  }
}
