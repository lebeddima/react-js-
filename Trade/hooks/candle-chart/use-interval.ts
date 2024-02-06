import { useRedux } from '@/hooks/useRedux'
import {
  selectInterval,
  selectIntervals,
  setInterval as set,
  TInit
} from '@/features/trade/store/candle-chart'

type TReturn = {
  currentInterval: TInit['currentInterval']
  intervals: TInit['intervals']
  setInterval: (x: TInit['currentInterval']) => void
}

export const useInterval = (): TReturn => {
  const [select, dispatch] = useRedux()

  const currentInterval = select(selectInterval)
  const intervals = select(selectIntervals)
  const setInterval: TReturn['setInterval'] = (x) => dispatch(set(x))

  return { currentInterval, intervals, setInterval }
}
