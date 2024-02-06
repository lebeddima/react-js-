import {
  QUANTITY_FIELD,
  PRICE_FIELD,
  TOTAL_FIELD
} from '@/features/trade/containers/create-order/constants'

export type TFields = {
  amount: string
  rate: string
  total: string
}

export type TChangeFieldProps = {
  name?: string
  value?: string
  notCalcRange?: boolean
}

export type TFieldName = typeof QUANTITY_FIELD | typeof PRICE_FIELD | typeof TOTAL_FIELD
