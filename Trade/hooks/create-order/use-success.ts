import { useRedux } from '@/hooks/useRedux'
import {
  selectSuccess,
  setSuccess as set,
  TInit
} from '@/features/trade/store/create-order'

type TReturn = {
  success: TInit['success']
  setSuccess: (x: TInit['success']) => void
}

export const useSuccess = (): TReturn => {
  const [select, dispatch] = useRedux()

  const success = select(selectSuccess)
  const setSuccess: TReturn['setSuccess'] = (x) => dispatch(set(x))

  return { success, setSuccess }
}
