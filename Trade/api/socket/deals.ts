import { socket, TEvent } from '@/api/socket/Socket'
import { TDeal } from '@/features/trade/store/deals'

type Tdeals = TDeal[]

type TSubscribeProps<T> = {
  id: TEvent<T>['id']
  pair: string
  onResponse: (data: T) => void
}

type TUnsubscribeProps<T> = {
  id: TEvent<T>['id']
  pair: string
}

function subscribe({ id, pair, onResponse }: TSubscribeProps<Tdeals>): void {
  socket.subscribe<Tdeals>({
    id,
    event: `deals:${pair}`,
    reconnect: true,
    initialData: true,
    onResponse
  })
}

function unsubscribe({ id, pair }: TUnsubscribeProps<Tdeals>): void {
  socket.unsubscribe({
    id,
    event: `deals:${pair}`
  })
}

export const dealsSocket = {
  subscribe,
  unsubscribe
}
