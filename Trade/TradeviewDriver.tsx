import { useEffect } from 'react'
import { useRedux } from '@/hooks/useRedux'
import { handleActionErrors } from '@/utils/handleActionErrors'
import { TPairName } from '@/types/global'
import { useGlobalFetching as useFetchingSwitchPairs } from '@/features/trade/hooks/switch-pairs/use-global-fetching'
import { apiExchangePair } from '@/features/trade/api/rest/exchange-pair'
import { apiWallet } from '@/features/trade/api/rest/wallet'
import { apiUser } from '@/api/requests/user'
import { joinPair } from '@/utils/join-pair'
import { useAuth } from '@/hooks/useAuth'
import { useFetching as useFetchingCreateOrder } from '@/features/trade/hooks/create-order/use-fetching'
import { useFee as useFeeCreateOrder } from '@/features/trade/hooks/create-order/use-fee'
import { reset as resetCreateOrder } from '@/features/trade/store/create-order'
import { reset as resetSwitchPairs } from '@/features/trade/store/switch-pairs'
import { reset as resetBook } from '@/features/trade/store/order-book'
import { reset as resetDeals } from '@/features/trade/store/deals'
import { reset as resetPair } from '@/features/trade/store/pair'
import { usePairName as usePairNameCandleChart } from '@/features/trade/hooks/candle-chart/use-pair-name'
import { usePair } from '@/features/trade/hooks/pair/use-pair'
import { usePairName } from '@/features/trade/hooks/pair/use-pair-name'
import { usePairSocket } from '@/features/trade/hooks/pair/use-pair-socket'
import { reset as resetCandleChart } from '@/features/trade/store/candle-chart'
import { useBalance as useBalanceCreateOrder } from '@/features/trade/hooks/create-order/use-balance'
import { ERROR_STATUS } from '@/constants/error-status'
import { showModalError } from '@/containers/GlobalErrors'

type TProps = {
  pairName: TPairName
}

export const TradeviewDriver: React.FC<TProps> = ({ pairName }) => {
  const [, dispatch] = useRedux()
  const { user } = useAuth()

  const { setGlobalFetching: setFetchingSwitchPairs } = useFetchingSwitchPairs()
  const { setFetching: setFetchingCreateOrder } = useFetchingCreateOrder()

  const { setBalances: setBalancesCreateOrder } = useBalanceCreateOrder()
  const { setFee: setFeeCreateOrder } = useFeeCreateOrder()

  const { setPairName: setPairNameCandleChart } = usePairNameCandleChart()
  const { setPair } = usePair()
  const { setPairName } = usePairName()

  const setFetching = (fetching: boolean) => {
    setFetchingSwitchPairs(fetching)
    setFetchingCreateOrder(fetching)
  }

  usePairSocket()

  useEffect(
    () => () => {
      apiExchangePair.cancellation.pair()
      apiWallet.cancellation.pairBalance()
      apiUser.cancellation.getFee()
      dispatch(resetCreateOrder())
      dispatch(resetSwitchPairs())
      dispatch(resetBook())
      dispatch(resetDeals())
      dispatch(resetCandleChart())
      dispatch(resetPair())
    },
    []
  )

  useEffect(() => {
    if (!pairName) return

    const getData = async () => {
      try {
        setFetching(true)

        setPairName(pairName)
        setPairNameCandleChart(pairName)

        const pair = joinPair({ pairName, separator: 'url' })

        const response = await Promise.all([
          apiExchangePair.pair(pair),
          user ? apiWallet.pairBalance(pair) : Promise.resolve(null),
          user ? apiUser.getFee() : Promise.resolve(null)
        ])

        setPair(response[0].data)

        if (response[1]) {
          setBalancesCreateOrder(response[1].data)
        }

        if (response[2]) {
          setFeeCreateOrder(response[2].data)
        }

        setFetching(false)
      } catch (e) {
        setFetching(false)
        handleActionErrors<{ pair: string }>({
          e,
          dispatch,
          additionalConditions: (status, data) => {
            if (status === ERROR_STATUS.VALIDATION) {
              dispatch(showModalError(data.message.pair))
              return true
            }
          }
        })
      }
    }

    getData()
  }, [pairName])

  return null
}
