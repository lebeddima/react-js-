import { useEffect, useRef } from 'react'
import { usePairName } from '@/features/trade/hooks/pair/use-pair-name'
import { usePair } from '@/features/trade/hooks/pair/use-pair'
import { pairSocket } from '@/features/trade/api/socket/pair'
import { useUnmount } from 'react-use'

type TUsePairSocket = () => void

const EVENT_ID = 'trade-pair'

export const usePairSocket: TUsePairSocket = () => {
  const { pairString } = usePairName()
  const { setPairSocket } = usePair()
  const subscribePair = useRef('')

  useUnmount(() => {
    pairSocket.unsubscribe({
      id: EVENT_ID,
      pair: subscribePair.current
    })
  })

  useEffect(() => {
    if (!pairString) return

    // unsubscribe
    if (subscribePair.current) {
      pairSocket.unsubscribe({
        id: EVENT_ID,
        pair: subscribePair.current
      })
    }

    // subscribe
    pairSocket.subscribe({
      id: EVENT_ID,
      pair: pairString,
      onResponse: (data) => setPairSocket(data)
    })

    subscribePair.current = pairString
  }, [pairString])

  return null
}
