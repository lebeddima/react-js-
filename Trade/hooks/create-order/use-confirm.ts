import { useRedux } from '@/hooks/useRedux'
import {
  selectConfirm,
  setConfirm as set,
  TInit
} from '@/features/trade/store/create-order'

type TReturn = {
  confirm: TInit['confirm']
  setConfirm: (x: TInit['confirm']) => void
}

export const useConfirm = (): TReturn => {
  const [select, dispatch] = useRedux()

  const confirm = select(selectConfirm)
  const setConfirm: TReturn['setConfirm'] = (x) => dispatch(set(x))

  return { confirm, setConfirm }
}
