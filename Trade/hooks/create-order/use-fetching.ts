import { useRedux } from '@/hooks/useRedux'
import {
  selectFetching,
  setFetching as set,
  TInit
} from '@/features/trade/store/create-order'

type TReturn = {
  fetching: TInit['fetching']
  setFetching: (x: boolean) => void
}

export const useFetching = (): TReturn => {
  const [select, dispatch] = useRedux()

  const fetching = select(selectFetching)
  const setFetching: TReturn['setFetching'] = (x) => dispatch(set(x))

  return { fetching, setFetching }
}
