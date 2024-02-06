import { useRedux } from '@/hooks/useRedux'
import {
  selectOrderType,
  setOrderType as set,
  TInit
} from '@/features/trade/store/create-order'

type TReturn = {
  orderType: TInit['orderType']
  setOrderType: (x: TInit['orderType']) => void
}

export const useOrderType = (): TReturn => {
  const [select, dispatch] = useRedux()

  const orderType = select(selectOrderType)
  const setOrderType: TReturn['setOrderType'] = (orderType) => dispatch(set(orderType))

  return { orderType, setOrderType }
}
