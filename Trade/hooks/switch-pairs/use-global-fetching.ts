import { useRedux } from '@/hooks/useRedux'
import {
  selectGlobalFetching,
  setGlobalFetching as set,
  TInit
} from '@/features/trade/store/switch-pairs'

type TReturn = {
  globalFetching: TInit['globalFetching']
  setGlobalFetching: (x: boolean) => void
}

export const useGlobalFetching = (): TReturn => {
  const [select, dispatch] = useRedux()

  const globalFetching = select(selectGlobalFetching)
  const setGlobalFetching: TReturn['setGlobalFetching'] = (x) => dispatch(set(x))

  return { globalFetching, setGlobalFetching }
}
