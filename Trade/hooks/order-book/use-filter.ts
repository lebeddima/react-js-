import { useRedux } from '@/hooks/useRedux'
import { selectFilter, setFilter as set, TInit } from '@/features/trade/store/order-book'

type TReturn = {
  filter: TInit['filter']
  setFilter: (x: TInit['filter']) => void
}

export const useFilter = (): TReturn => {
  const [select, dispatch] = useRedux()

  const filter = select(selectFilter)
  const setFilter: TReturn['setFilter'] = (x) => dispatch(set(x))

  return { filter, setFilter }
}
