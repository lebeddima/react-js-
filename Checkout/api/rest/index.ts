import { api } from '@/api-rest/instance'
import { TAxiosResponse } from '@/api-rest/types'
import {
  TGetDeliveriesRes,
  TGetDeliveryAddressRes,
  TSaveDeliveryAddressReq,
  TGetProductsReq,
  TGetProductsRes,
  TGetPromocodeReq,
  TGetPromocodeRes,
  TGetSkyflowToken,
  TSaveCardReq,
  TGetCardsRes,
  TSaveCardRes,
  TCreateOrderReq,
  TSaveDeliveryAddressRes,
  TValidatePersonalInfoReq,
  TCreateOrderRes,
  TPayRes,
} from './types'

const getProducts = (data: TGetProductsReq): TAxiosResponse<TGetProductsRes> =>
  api.post('/cart/products', { cart: data })

const getPromocode = (data: TGetPromocodeReq): TAxiosResponse<TGetPromocodeRes> =>
  api.get('/cart/promocode', { params: data })

const getSkyflowToken = (): TAxiosResponse<TGetSkyflowToken> => api.get('/skyflow/token')

const saveCard = (data: TSaveCardReq): TAxiosResponse<TSaveCardRes> =>
  api.post('/account/cards/store', data)

const getCards = (): TAxiosResponse<TGetCardsRes> => api.get('/account/cards')

const getDeliveries = (): TAxiosResponse<TGetDeliveriesRes> => api.get('/deliveries')

const getDeliveryAddress = (): TAxiosResponse<TGetDeliveryAddressRes> =>
  api.get('/account/address')

const saveDeliveryAddress = (
  data: TSaveDeliveryAddressReq,
): TAxiosResponse<TSaveDeliveryAddressRes> => api.post('/account/address/save', data)

const validatePersonalInfo = (data: TValidatePersonalInfoReq): TAxiosResponse<null> =>
  api.post('/cart/personal-validation', data)

const createOrder = (data: TCreateOrderReq): TAxiosResponse<TCreateOrderRes> =>
  api.post('/cart/checkout', data)

const pay = (orderId: number): TAxiosResponse<TPayRes> =>
  api.post('/cart/pay', { orderId })

export const apiCheckout = {
  getProducts,
  getPromocode,
  getDeliveries,
  getDeliveryAddress,
  saveDeliveryAddress,
  validatePersonalInfo,
  getSkyflowToken,
  saveCard,
  getCards,
  createOrder,
  pay,
}
