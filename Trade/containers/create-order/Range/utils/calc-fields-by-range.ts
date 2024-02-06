import { TOrderSide } from '@/types/global'
import { TInit } from '@/features/trade/store/create-order'
import { TInit as TInitPair } from '@/features/trade/store/pair'
import { cutDecimals } from '@/utils/cut-decimals'
import { TFieldName } from '@/features/trade/containers/create-order/FormLimit/types'
import D from '@/utils/decimal'
import {
  QUANTITY_FIELD,
  TOTAL_FIELD
} from '@/features/trade/containers/create-order/constants'

type Props = {
  range: string
  balance: TInit['balance']
  side: TOrderSide
  pair: TInitPair['pair']
}

type TCalcFieldsByRange = (props: Props) => {
  name: TFieldName
  value: string
} | null

const isNotValidVal = (val: string) => val === '0' || val === 'NaN' || val === 'Infinity'

export const calcFieldsByRange: TCalcFieldsByRange = ({ range, balance, pair, side }) => {
  if (!balance || !pair) {
    return null
  }

  const { availableBalance } = balance

  if (side === 'bid') {
    const value = new D(availableBalance).dividedBy('100').times(new D(range)).toFixed()

    return {
      name: TOTAL_FIELD,
      value: isNotValidVal(value) ? '' : cutDecimals(value, pair.totalDecimals)
    }
  }

  if (side === 'ask') {
    const value = new D(availableBalance).dividedBy('100').times(new D(range)).toFixed()
    return {
      name: QUANTITY_FIELD,
      value: isNotValidVal(value) ? '' : cutDecimals(value, pair.quantityDecimals)
    }
  }

  return null
}
