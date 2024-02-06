export type TShoppingCartProduct = {
  id: number
  name: string
  measure: string
  price: number
  uri: string
  photo: string
  brandName: string
  quantity: number
  cannabisVolume: string
  cannabisWeight: string
}

export type TShoppingCartDispensary = {
  id: number
  dispName: string
  uri: string
  photo: string
}

export type TShoppingCartList = {
  product: TShoppingCartProduct
  quantity: number
}[]

export type TShoppingCartItem = {
  dispensary: TShoppingCartDispensary
  products: TShoppingCartProduct[]
  tax: number
  total: number
}

export type TShoppingCartStorage = { id: number; quantity: number }[]

export type TPromocode = {
  id: number
  code: string
  discountPercent: number
}

export type TCheckoutPersonalInfo = {
  firstName: string
  lastName: string
  birthDate: string
  phone: string
}

export type TCheckoutSignUpForm = TCheckoutPersonalInfo & {
  password: string
  repeatPassword: string
  terms: boolean
  referralCode: string
}

export type TDelivery = {
  id: number
  name: string
  isAddrRequired: 0 | 1
}

export type TDeliveryAddress = {
  address: string
  unit: string
  id: number
}

export type TSkyFlowRecord = {
  table: string
  fields: {
    number: string
    skyflow_id: string
    expire_month: string
    expire_year: string
    holder_name: string
  }
}

export type TGetSkyFlowRecordsRes = {
  records: TSkyFlowRecord[]
}

export type TSavedCard = {
  id: number
  isMasterCard: boolean
  isVisa: boolean
  number: string
}

export type TDetokenizedCard = {
  id: number
  number: string
}
