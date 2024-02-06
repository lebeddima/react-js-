import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { TSelector } from '@/store'

export type TInit = {
  open: boolean
}

const init: TInit = {
  open: false,
}

const logoutModal = createSlice({
  name: 'logoutModal',
  initialState: init,
  reducers: {
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload
    },
    reset: () => init,
  },
})

// actions
export const { actions } = logoutModal
// selectors
export const selectLogoutModal: TSelector<TInit> = (state) => state.logoutModal
// reducer
export default logoutModal.reducer

export const { setOpen, reset } = logoutModal.actions
