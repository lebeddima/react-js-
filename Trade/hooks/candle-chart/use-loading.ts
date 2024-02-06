import { useRedux } from '@/hooks/useRedux'
import {
  TInit,
  selectInitLoading,
  selectLoading,
  setLoading as set
} from '@/features/trade/store/candle-chart'

type TReturn = {
  initLoading: TInit['initLoading']
  setLoading: (x: TInit['loading']) => void
  loading: TInit['loading']
}

export const useLoading = (): TReturn => {
  const [select, dispatch] = useRedux()

  const initLoading = select(selectInitLoading)
  const loading = select(selectLoading)
  const setLoading: TReturn['setLoading'] = (x) => dispatch(set(x))

  return { initLoading, loading, setLoading }
}
