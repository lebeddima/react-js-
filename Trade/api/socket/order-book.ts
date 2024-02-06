import { socket, TEvent } from '@/api/socket/Socket'
import { TOrderBook } from '@/features/trade/store/order-book'

type TSubscribeProps<T> = {
  id: TEvent<T>['id']
  pair: string
  onResponse: (data: T) => void
}

type TUnsubscribeProps<T> = {
  id: TEvent<T>['id']
  pair: string
}

function subscribe({ id, pair, onResponse }: TSubscribeProps<TOrderBook>): void {
  socket.subscribe<TOrderBook>({
    id,
    event: `order_book:${pair}`,
    reconnect: true,
    initialData: true,
    onResponse
  })
}

function unsubscribe({ id, pair }: TUnsubscribeProps<TOrderBook>): void {
  socket.unsubscribe({
    id,
    event: `order_book:${pair}`
  })
}

export const orderBookSocket = {
  subscribe,
  unsubscribe
}
