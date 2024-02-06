import { SHOPPING_CART } from '@/constants/local-storage'
import { TShoppingCartStorage } from '../../types'

export const shoppingCartStorage = {
  set(cart: TShoppingCartStorage): void {
    localStorage.setItem(SHOPPING_CART, JSON.stringify(cart))
  },
  get(): TShoppingCartStorage | null {
    const cachedCart = localStorage.getItem(SHOPPING_CART)

    if (!cachedCart) {
      return null
    }

    return JSON.parse(cachedCart)
  },
  remove(): void {
    localStorage.removeItem(SHOPPING_CART)
  },
}
