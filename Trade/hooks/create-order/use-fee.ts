import { useRedux } from '@/hooks/useRedux'
import { selectFee, setFees as set, TInit } from '@/features/trade/store/create-order'

type TReturn = {
  fee: string
  setFee: (x: TInit['fees']) => void
}

export const useFee = (): TReturn => {
  const [select, dispatch] = useRedux()

  const fee = select(selectFee)
  const setFee: TReturn['setFee'] = (x) => dispatch(set(x))

  return { fee, setFee }
}
