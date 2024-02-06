import { useRedux } from '@/hooks/useRedux'
import { selectError, setError as set, TInit } from '@/features/trade/store/candle-chart'

type TReturn = {
  error: TInit['error']
  setError: (x: TInit['error']) => void
}

export const useError = (): TReturn => {
  const [select, dispatch] = useRedux()

  const error = select(selectError)
  const setError: TReturn['setError'] = (x) => dispatch(set(x))

  return { error, setError }
}
