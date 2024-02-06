import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TSelector } from '@/store'

export type TOrder = {
  p: string
  pr: string
  q: string
  v: string
}

export type TOrderBook = {
  bids: TOrder[]
  asks: TOrder[]
}

export type TInit = {
  book: TOrderBook
  filter: 'all' | 'bids' | 'asks'
}

export const init: TInit = {
  book: {
    bids: [],
    asks: []
  },
  filter: 'all'
}

const orderBook = createSlice({
  name: 'order-book',
  initialState: init,
  reducers: {
    setBook(state, action: PayloadAction<TInit['book']>) {
      state.book = action.payload
    },
    resetBook(state) {
      state.book = init.book
    },
    setFilter(state, action: PayloadAction<TInit['filter']>) {
      state.filter = action.payload
    },
    reset: () => init
  }
})

export const { reset, setBook, resetBook, setFilter } = orderBook.actions

// selectores
export const selectBook: TSelector<TInit['book']> = (state) => state.orderBook.book
export const selectFilter: TSelector<TInit['filter']> = (state) => state.orderBook.filter

// reducer
export default orderBook.reducer
