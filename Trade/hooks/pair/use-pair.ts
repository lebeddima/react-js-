import { useRedux } from '@/hooks/useRedux'
import { TPair } from '@/types/global'
import { selectPair, setPair, setPairSocket, TInit } from '@/features/trade/store/pair'
import { TResponse as TResponseSocket } from '@/features/trade/api/socket/pair'

type TReturn = {
  pair: TInit['pair']
  setPair: (x: TPair) => void
  setPairSocket: (x: TResponseSocket) => void
}

export const usePair = (): TReturn => {
  const [select, dispatch] = useRedux()

  return {
    pair: select(selectPair),
    setPair: (x) => dispatch(setPair(x)),
    setPairSocket: (x) => dispatch(setPairSocket(x))
  }
}
