import React, { useEffect, useRef } from 'react'
import { orderBookSocket } from '@/features/trade/api/socket/order-book'
import { Header } from '@/features/trade/containers/order-book/Header'
import { useBook } from '@/features/trade/hooks/order-book/use-book'
import { List } from '@/features/trade/containers/order-book/List'
import { usePairName } from '@/features/trade/hooks/pair/use-pair-name'
import { useUnmount } from 'react-use'

const EVENT_ID = 'orderbook'

export const OrderBook: React.FC = () => {
  const { setBook, resetBook } = useBook()
  const { pairString: pair } = usePairName()
  const subscribePair = useRef('')

  useUnmount(() => {
    orderBookSocket.unsubscribe({
      id: EVENT_ID,
      pair: subscribePair.current
    })
  })

  useEffect(() => {
    if (!pair) return

    resetBook()

    // unsubscribe
    if (subscribePair.current) {
      orderBookSocket.unsubscribe({
        id: EVENT_ID,
        pair: subscribePair.current
      })
    }

    // subscribe
    orderBookSocket.subscribe({
      id: EVENT_ID,
      pair,
      onResponse: (data) => setBook(data)
    })

    subscribePair.current = pair
  }, [pair])

  return (
    <>
      <Header />
      <List />
    </>
  )
}
