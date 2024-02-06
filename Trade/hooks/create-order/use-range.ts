import { useRedux } from '@/hooks/useRedux'
import { selectRange, setRange as set, TInit } from '@/features/trade/store/create-order'

type TReturn = {
  range: TInit['range']
  setRange: (x: TInit['range']) => void
}

export const useRange = (): TReturn => {
  const [select, dispatch] = useRedux()

  const range = select(selectRange)
  const setRange: TReturn['setRange'] = (range) => dispatch(set(range))

  return { range, setRange }
}
