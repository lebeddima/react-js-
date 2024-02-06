import { useRedux } from '@/hooks/useRedux'
import {
  selectPairName,
  setPairName as set,
  selectPairString,
  TInit
} from '@/features/trade/store/pair'

type TReturn = {
  pairName: TInit['pairName']
  pairString: TInit['pairString']
  setPairName: (x: TInit['pairName']) => void
}

export const usePairName = (): TReturn => {
  const [select, dispatch] = useRedux()

  const pairName = select(selectPairName)
  const pairString = select(selectPairString)
  const setPairName: TReturn['setPairName'] = (x) => dispatch(set(x))

  return { pairName, setPairName, pairString }
}
