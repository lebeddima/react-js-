import { useRedux } from '@/hooks/useRedux'
import {
  selectBook,
  setBook as set,
  resetBook as reset,
  TInit
} from '@/features/trade/store/order-book'

type TReturn = {
  book: TInit['book']
  setBook: (x: TInit['book']) => void
  resetBook: () => void
}

export const useBook = (): TReturn => {
  const [select, dispatch] = useRedux()

  const book = select(selectBook)
  const setBook: TReturn['setBook'] = (x) => dispatch(set(x))
  const resetBook: TReturn['resetBook'] = () => dispatch(reset())

  return { book, setBook, resetBook }
}
