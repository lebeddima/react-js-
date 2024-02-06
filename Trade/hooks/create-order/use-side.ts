import { useRedux } from '@/hooks/useRedux'
import { selectSide, setSide as set, TInit } from '@/features/trade/store/create-order'

type TReturn = {
  side: TInit['side']
  setSide: (x: TInit['side']) => void
}

export const useSide = (): TReturn => {
  const [select, dispatch] = useRedux()

  const side = select(selectSide)
  const setSide: TReturn['setSide'] = (side) => dispatch(set(side))

  return { side, setSide }
}
