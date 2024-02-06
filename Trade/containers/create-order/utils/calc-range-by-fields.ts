import { TOrderSide } from '@/types/global'
import { TInit } from '@/features/trade/store/create-order'
import { TFields } from '@/features/trade/containers/create-order/FormLimit/types'
import D from '@/utils/decimal'
import {
  QUANTITY_FIELD,
  TOTAL_FIELD
} from '@/features/trade/containers/create-order/constants'

type Props = {
  balance: TInit['balance']
  side: TOrderSide
  fields: TFields
}

type TCalcRangeByFields = (props: Props) => string

const isNotValidVal = (val: string) => val === '0' || val === 'NaN' || val === 'Infinity'

export const calcRangeByFields: TCalcRangeByFields = ({ balance, side, fields }) => {
  let result = '0'

  if (!balance) {
    return result
  }

  const root = side === 'bid' ? fields[TOTAL_FIELD] : fields[QUANTITY_FIELD]

  if (!root) return result

  let precent = result

  try {
    precent = new D(root).dividedBy(new D(balance.availableBalance)).times(100).toFixed(0)
  } catch (e) {
    return result
  }

  return isNotValidVal(precent) ? '0' : precent
}
