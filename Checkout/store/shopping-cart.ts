import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { TAsyncAction, TSelector } from '@/store'
import { handleActionErrors } from '@/utils/handle-action-errors'
import { apiCheckout } from '../api/rest'
import { TShoppingCartItem, TShoppingCartStorage } from '../types'
import { shoppingCartStorage } from '../api/browser/shopping-cart-storage'

export type TInit = {
  fetching: boolean
  fetchingShopCartItemById?: number
  show: boolean
  initialFetching: boolean
  cart: TShoppingCartItem[]
}

const init: TInit = {
  fetching: false,
  show: false,
  initialFetching: true,
  cart: [],
}

const shoppingCart = createSlice({
  name: 'shopping-cart',
  initialState: init,
  reducers: {
    setFetching: (state, { payload }: PayloadAction<boolean>) => {
      state.fetching = payload
    },
    setfetchingShopCartItemById: (
      state,
      { payload }: PayloadAction<TInit['fetchingShopCartItemById']>,
    ) => {
      state.fetchingShopCartItemById = payload
    },
    openShoppingCart: (state) => {
      state.show = true
    },
    closeShoppingCart: (state) => {
      state.show = false
    },
    setProducts: (state, { payload }: PayloadAction<TShoppingCartItem[]>) => {
      state.cart = payload
      state.initialFetching = false
    },
    updateProduct: (
      state,
      { payload }: PayloadAction<{ id: number; quantity: number }>,
    ) => {
      const { cart } = state
      const { id, quantity } = payload

      cart.forEach((item, cartIndex) => {
        const productIndex = item.products.findIndex((product) => product.id === id)

        if (productIndex !== -1) {
          // Update the product quantity
          state.cart[cartIndex].products[productIndex].quantity = quantity

          // Update total price
          state.cart[cartIndex].total = item.products.reduce(
            (sum, product) => sum + product.price * product.quantity,
            0,
          )
        }
      })
    },
    removeProduct: (state, { payload }: PayloadAction<{ id: number }>) => {
      const { cart } = state
      const { id } = payload

      cart.forEach((item, cartIndex) => {
        const productIndex = item.products.findIndex((product) => product.id === id)

        if (productIndex !== -1) {
          // Remove the product from the products array
          state.cart[cartIndex].products.splice(productIndex, 1)

          // Check if the products array is empty
          if (state.cart[cartIndex].products.length === 0) {
            // Remove the dispensary object from the cart array
            state.cart.splice(cartIndex, 1)
          } else {
            // Update the dispensary total
            state.cart[cartIndex].total = state.cart[cartIndex].products.reduce(
              (sum, product) => sum + product.price * product.quantity,
              0,
            )
          }
        }
      })
    },
    removeDispensary: (state, { payload }: PayloadAction<{ id: number }>) => {
      const { cart } = state
      const { id } = payload

      const dispensaryIndex = cart.findIndex((item) => item.dispensary.id === id)

      if (dispensaryIndex !== -1) {
        state.cart.splice(dispensaryIndex, 1)
      }
    },
    reset: () => init,
  },
})

export const {
  setFetching,
  setfetchingShopCartItemById,
  openShoppingCart,
  closeShoppingCart,
  setProducts,
  updateProduct,
  removeProduct,
  removeDispensary,
  reset,
} = shoppingCart.actions

export const selectShoppingCart: TSelector<TInit> = (state) => state.shoppingCart

export const selectfetchingShopCartItemById: TSelector<
  TInit['fetchingShopCartItemById']
> = (state) => state.shoppingCart.fetchingShopCartItemById

export default shoppingCart.reducer

export const fetchProducts = (): TAsyncAction => async (dispatch) => {
  try {
    const cartInStorage = shoppingCartStorage.get()

    if (cartInStorage) {
      dispatch(setFetching(true))
      const { data } = await apiCheckout.getProducts(cartInStorage)
      dispatch(setProducts(data.cart))
    }
  } catch (e) {
    handleActionErrors({ e, dispatch })
  } finally {
    dispatch(setFetching(false))
  }
}

export type TAddProduct = {
  id: number
  quantity: number
}

export const addProduct =
  (params: TAddProduct): TAsyncAction =>
  async (dispatch, getState) => {
    try {
      const { cart } = getState().shoppingCart

      const isProductAlreadyInCart = cart.some((item) =>
        item.products.some((product) => product.id === params.id),
      )

      const simpleData = cart.reduce<TShoppingCartStorage>((accumulator, item) => {
        const products = item.products.map((product) => ({
          id: product.id,
          quantity: product.quantity,
        }))
        return accumulator.concat(products)
      }, [])

      if (isProductAlreadyInCart) {
        const oldProductQuantity = cart.reduce<number>((accumulator, item) => {
          const product = item.products.find((product) => product.id === params.id)
          return product ? accumulator + product.quantity : accumulator
        }, 0)

        const newQuantity = oldProductQuantity + params.quantity

        dispatch(updateProduct({ id: params.id, quantity: newQuantity }))
      } else {
        dispatch(setfetchingShopCartItemById(params.id))
        const { data } = await apiCheckout.getProducts([...simpleData, params])
        dispatch(setProducts(data.cart))
      }
      dispatch(openShoppingCart())
    } catch (e) {
      handleActionErrors({ e, dispatch })
    } finally {
      dispatch(setfetchingShopCartItemById(undefined))
    }
  }

export const addProducts =
  (params: TAddProduct[]): TAsyncAction =>
  async (dispatch, getState) => {
    try {
      if (params.length === 0) return

      const { cart } = getState().shoppingCart

      const previousProducts = cart.reduce<TShoppingCartStorage>((accumulator, item) => {
        const products = item.products.map((product) => ({
          id: product.id,
          quantity: product.quantity,
        }))
        return accumulator.concat(products)
      }, [])

      const combinedArray = previousProducts.concat(params)

      // Next, reduce the combined array to merge items with the same id
      const result = combinedArray.reduce<TAddProduct[]>((acc, curr) => {
        // Find an item in the accumulator array that has the same id as the current item
        const existingItem = acc.find((item) => item.id === curr.id)

        if (existingItem) {
          // If such an item exists, increment its quantity
          existingItem.quantity += curr.quantity
        } else {
          // If no such item exists, add the current item to the accumulator array
          acc.push(curr)
        }

        return acc
      }, [])

      dispatch(setFetching(true))
      const { data } = await apiCheckout.getProducts(result)
      dispatch(setProducts(data.cart))
      dispatch(openShoppingCart())
    } catch (e) {
      handleActionErrors({ e, dispatch })
    } finally {
      dispatch(setFetching(false))
    }
  }
