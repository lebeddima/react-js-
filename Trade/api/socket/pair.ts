import { socket, TEvent } from '@/api/socket/Socket'

export type TResponse = {
  lastPriceFiat: string
  mainVolume: string
  baseVolume: string
  maxPrice: string
  minPrice: string
}

type TSubscribeProps<T> = {
  id: TEvent<T>['id']
  pair: string
  onResponse: (data: T) => void
}

type TUnsubscribeProps<T> = {
  id: TEvent<T>['id']
  pair: string
}

function subscribe({ id, pair, onResponse }: TSubscribeProps<TResponse>): void {
  socket.subscribe<TResponse>({
    id,
    event: `state:${pair}`,
    reconnect: true,
    initialData: true,
    onResponse
  })
}

function unsubscribe({ id, pair }: TUnsubscribeProps<TResponse>): void {
  socket.unsubscribe({
    id,
    event: `state:${pair}`
  })
}

export const pairSocket = {
  subscribe,
  unsubscribe
}
