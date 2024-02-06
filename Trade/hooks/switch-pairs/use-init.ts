import { useRedux } from '@/hooks/useRedux'
import { selectInit, TInit } from '@/features/trade/store/switch-pairs'

type TReturn = {
  init: TInit['init']
}

export const useInit = (): TReturn => {
  const [select] = useRedux()
  const init = select(selectInit)

  return { init }
}
