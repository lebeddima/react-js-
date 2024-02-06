import { useRedux } from '@/hooks/useRedux'
import { selectPairs, TInit } from '@/features/trade/store/switch-pairs'

type TReturn = {
  pairs: TInit['pairs']
}

export const usePairs = (): TReturn => {
  const [select] = useRedux()
  const pairs = select(selectPairs)

  return { pairs }
}
