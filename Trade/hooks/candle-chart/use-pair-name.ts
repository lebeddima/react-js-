import { useRedux } from '@/hooks/useRedux'
import { selectPairName, setPairData, TInit } from '@/features/trade/store/candle-chart'

type TReturn = {
  pairName: TInit['pairName']
  setPairName: (x: TInit['pairName']) => void
}

export const usePairName = (): TReturn => {
  const [select, dispatch] = useRedux()

  const pairName = select(selectPairName)
  const setPairName: TReturn['setPairName'] = (x) => dispatch(setPairData(x))

  return { pairName, setPairName }
}
