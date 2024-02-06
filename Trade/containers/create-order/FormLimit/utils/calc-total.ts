import { cutDecimals } from '@/utils/cut-decimals'
import { TInit as TInitPair } from '@/features/trade/store/pair'
import { TFields } from '@/features/trade/containers/create-order/FormLimit/types'
import D from '@/utils/decimal'
import {
  QUANTITY_FIELD,
  PRICE_FIELD
} from '@/features/trade/containers/create-order/constants'

type Props = {
  fields: TFields
  pair: TInitPair['pair']
}

type TCalcTotal = (props: Props) => string

const isNotValidVal = (val: string) => val === '0' || val === 'NaN' || val === 'Infinity'

export const calcTotal: TCalcTotal = ({ fields, pair }) => {
  let total = ''
  if (!pair) return total

  try {
    if (fields[QUANTITY_FIELD] && fields[PRICE_FIELD]) {
      const result = new D(fields[QUANTITY_FIELD])
        .times(new D(fields[PRICE_FIELD]))
        .toFixed()
      total = isNotValidVal(result) ? '' : cutDecimals(result, pair.totalDecimals)
    }
  } catch (e) {
    return ''
  }

  return total
}
