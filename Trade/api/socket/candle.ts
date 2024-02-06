import { socket, TEvent } from '@/api/socket/Socket'
import { Bar } from '@/features/trade/types/tradeview'

type TCreateEventProps = {
  pair: string
  interval: string
}
type TCreateEventName = ({ pair, interval }: TCreateEventProps) => string

export const createEventName: TCreateEventName = ({ pair, interval }) =>
  `kgraph:${pair}:${interval}`

type TSubscribeProps<T> = {
  id: TEvent<T>['id']
  event: string
  onResponse: (data: T) => void
  onReconnect?: () => void
}

type TUnsubscribeProps<T> = {
  id: TEvent<T>['id']
  event: string
}

type TResponce = {
  lastKindle: Bar
  tempKindle: Bar
}

function subscribe({
  id,
  event,
  onResponse,
  onReconnect
}: TSubscribeProps<TResponce>): void {
  socket.subscribe<TResponce>({
    id,
    event,
    onResponse,
    onReconnect
  })
}

function unsubscribe({ id, event }: TUnsubscribeProps<TResponce>): void {
  socket.unsubscribe({
    id,
    event
  })
}

export const candleSocket = {
  subscribe,
  unsubscribe
}
