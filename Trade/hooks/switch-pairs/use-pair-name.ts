import { useRedux } from '@/hooks/useRedux'
import { TPairName } from '@/types/global'
import {
  selectPairName,
  setPairName as set,
  TInit
} from '@/features/trade/store/switch-pairs'

type TReturn = {
  setPairName: (x: TPairName) => void
  pairName: TInit['pairName']
}

export const usePairName = (): TReturn => {
  const [select, dispatch] = useRedux()

  const pairName = select(selectPairName)
  const setPairName: TReturn['setPairName'] = (pairName) => dispatch(set(pairName))

  return { pairName, setPairName }
}
