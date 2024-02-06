import { cutDecimals } from '@/utils/cut-decimals'
import { TInit as TInitPair } from '@/features/trade/store/pair'
import D from '@/utils/decimal'
import { TFields } from '@/features/trade/containers/create-order/FormLimit/types'
import {
  QUANTITY_FIELD,
  PRICE_FIELD,
  TOTAL_FIELD
} from '@/features/trade/containers/create-order/constants'

type Props = {
  fields: TFields
  pair: TInitPair['pair']
}

type ReturnValues = TFields

type TCalcQuantity = (props: Props) => ReturnValues

const isNotValidVal = (val: string) => val === '0' || val === 'NaN' || val === 'Infinity'

export const calcQuantity: TCalcQuantity = ({ fields, pair }) => {
  const result: ReturnValues = {
    [QUANTITY_FIELD]: '',
    [PRICE_FIELD]: '',
    [TOTAL_FIELD]: fields[TOTAL_FIELD]
  }

  if (!pair) return result

  try {
    if (fields.total && pair.lastPrice) {
      const quantity = new D(fields.total).dividedBy(new D(pair.lastPrice)).toFixed()

      result[QUANTITY_FIELD] = isNotValidVal(quantity)
        ? ''
        : cutDecimals(quantity, pair.quantityDecimals)
      return result
    }
  } catch (e) {
    return result
  }

  return result
}
