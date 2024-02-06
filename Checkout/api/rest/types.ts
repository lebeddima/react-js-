import { PAYMENT_STATUS } from '../../constants/payment-status'
import {
  TCheckoutPersonalInfo,
  TDelivery,
  TDeliveryAddress,
  TPromocode,
  TSavedCard,
  TShoppingCartItem,
} from '../../types'

export type TGetProductsReq = { id: number; quantity: number }[]

export type TGetProductsRes = {
  cart: TShoppingCartItem[]
}

export type TGetPromocodeReq = { code: string; dispensaryId: number }

export type TGetPromocodeRes = TPromocode

export type TGetDeliveriesRes = TDelivery[]

export type TGetDeliveryAddressRes = TDeliveryAddress

export type TSaveDeliveryAddressReq = Partial<TDeliveryAddress>

export type TValidatePersonalInfoReq = TCheckoutPersonalInfo

export type TSaveDeliveryAddressRes = TDeliveryAddress

export type TGetSkyflowToken = { accessToken: string; tokenType: string }

export type TSaveCardReq = {
  serviceId: string
}

export type TSaveCardRes = TSavedCard

export type TGetCardsRes = TSavedCard[]

export type TCreateOrderReq = {
  dispensaryId: number
  cart: string
  firstName: string
  lastName: string
  phone: string
  birthDate: string
  deliveryId: number
  addressId?: number
  credits?: number
  promocode?: string
  deliveryNote?: string
  cardId: number
}

export type TCreateOrderRes = {
  message: string
  orderId: number
}

export type TPayRes = {
  id: number
  cost: number
  currency: string
  message: string
  status: PAYMENT_STATUS
}
