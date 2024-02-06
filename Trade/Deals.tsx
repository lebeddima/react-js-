import { dealsSocket } from '@/features/trade/api/socket/deals'
import React, { useEffect, useRef } from 'react'
import { usePairName } from '@/features/trade/hooks/pair/use-pair-name'
import { Deals as Container } from '@/features/trade/containers/Deals'
import { joinPair } from '@/utils/join-pair'
import { useDeals } from '@/features/trade/hooks/deals/use-deals'
import { useUnmount } from 'react-use'

const EVENT_ID = 'deals'

export const Deals: React.FC = () => {
  const { setDeals, setIsInit } = useDeals()
  const { pairName } = usePairName()
  const subscribePair = useRef('')

  const pair = joinPair({ pairName, separator: 'url' })

  useUnmount(() => {
    dealsSocket.unsubscribe({
      id: EVENT_ID,
      pair: subscribePair.current
    })
  })

  useEffect(() => {
    if (!pair) return

    // unsubscribe
    if (subscribePair.current) {
      dealsSocket.unsubscribe({
        id: EVENT_ID,
        pair: subscribePair.current
      })
    }

    // subscribe
    setIsInit()

    dealsSocket.subscribe({
      id: EVENT_ID,
      pair,
      onResponse: (data) => setDeals(data)
    })

    subscribePair.current = pair
  }, [pair])

  return <Container />
}
