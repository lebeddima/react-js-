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
    if (fields.total && fields[PRICE_FIELD]) {
      const quantity = new D(fields.total)
        .dividedBy(new D(fields[PRICE_FIELD]))
        .toDecimalPlaces(pair.quantityDecimals, D.ROUND_UP)
        .toFixed()

      result[QUANTITY_FIELD] = isNotValidVal(quantity)
        ? ''
        : cutDecimals(quantity, pair.quantityDecimals)

      result[PRICE_FIELD] = fields[PRICE_FIELD] === '0' ? '' : fields[PRICE_FIELD]

      return result
    }

    if (fields.total && fields[QUANTITY_FIELD] && !fields[PRICE_FIELD]) {
      const price = new D(fields.total)
        .dividedBy(new D(fields[QUANTITY_FIELD]))
        .toDecimalPlaces(pair.priceDecimals, D.ROUND_UP)
        .toFixed()

      result[PRICE_FIELD] = isNotValidVal(price)
        ? ''
        : cutDecimals(price, pair.priceDecimals)

      result[QUANTITY_FIELD] =
        fields[QUANTITY_FIELD] === '0' ? '' : fields[QUANTITY_FIELD]

      return result
    }
  } catch (e) {
    return result
  }

  return result
}
