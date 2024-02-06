import { useRedux } from '@/hooks/use-redux'
import {
  openShoppingCart as openShoppingCartAction,
  closeShoppingCart as closeShoppingCartAction,
  addProduct as addProductAction,
  addProducts as addProductsAction,
  updateProduct as updateProductAction,
  removeProduct as removeProductAction,
  TInit,
  selectShoppingCart,
  fetchProducts,
  TAddProduct,
} from '../store/shopping-cart'

type TUseLocation = TInit & {
  init: () => void
  open: () => void
  close: () => void
  addProduct: (productId: number, quantity: number) => void
  addProducts: (products: TAddProduct[]) => void
  updateProduct: (productId: number, newQuantity: number) => void
  removeProduct: (productId: number) => void
}

export const useShoppingCart = (): TUseLocation => {
  const { select, dispatch } = useRedux()
  const shoppingCart = select(selectShoppingCart)

  const open = () => dispatch(openShoppingCartAction())
  const close = () => dispatch(closeShoppingCartAction())
  const init = () => dispatch(fetchProducts())

  const addProduct = (productId: number, quantity: number) =>
    dispatch(addProductAction({ id: productId, quantity }))

  const addProducts = (products: TAddProduct[]) => dispatch(addProductsAction(products))

  const updateProduct = (productId: number, newQuantity: number) => {
    dispatch(updateProductAction({ id: productId, quantity: newQuantity }))
  }

  const removeProduct = (productId: number) => {
    dispatch(removeProductAction({ id: productId }))
  }

  return {
    ...shoppingCart,
    init,
    open,
    close,
    addProduct,
    addProducts,
    updateProduct,
    removeProduct,
  }
}
