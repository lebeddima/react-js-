import { TShoppingCartProduct } from '../types'

export const getTotalCannabisWeight = (products: TShoppingCartProduct[]): number =>
  products.reduce(
    (acc, product) => acc + product.quantity * Number(product.cannabisWeight),
    0,
  )
