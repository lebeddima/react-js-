import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { TAsyncAction, TSelector } from '@/store'
import { TFormPropsAsync } from '@/types/formik'
import { handleActionErrors } from '@/utils/handle-action-errors'
import Router from 'next/router'
import { ROUTES } from '@/constants/routes'
import { ERROR_STATUS } from '@/constants/error-status'
import {
  TCheckoutPersonalInfo,
  TDelivery,
  TDeliveryAddress,
  TDetokenizedCard,
  TSavedCard,
  TShoppingCartItem,
} from '../types'
import { apiCheckout } from '../api/rest'
import {
  TSaveCardReq,
  TSaveDeliveryAddressReq,
  TValidatePersonalInfoReq,
} from '../api/rest/types'
import { removeDispensary } from './shopping-cart'
import { PAYMENT_STATUS } from '../constants/payment-status'

export type TInit = {
  step: 'personal-info' | 'payment' | 'confirmation' | 'success'
  dispensaryId: number | null
  loginModal: boolean
  deliveryAddressModal: boolean
  personalInfo: TCheckoutPersonalInfo | null
  deliveries: TDelivery[]
  selectedDelivery: TDelivery | null
  deliveryAddress: TDeliveryAddress | null
  deliveryAddressRequiredError: boolean
  deliveryNoteForm: boolean
  deliveryNote: string
  cards: TSavedCard[]
  detokenizedCards: TDetokenizedCard[]
  savingCard: boolean
  fetchingCards: boolean
  selectedCard: TSavedCard | null
  submitting: boolean
  orderId: number | null
  paymentError: 'first-payment' | 'try-again' | false
  paymentErrorMessage: string
}

const init: TInit = {
  step: 'personal-info',
  dispensaryId: null,
  loginModal: false,
  deliveryAddressModal: false,
  personalInfo: null,
  deliveries: [],
  deliveryAddress: null,
  deliveryAddressRequiredError: false,
  deliveryNoteForm: false,
  deliveryNote: '',
  selectedDelivery: null,
  savingCard: false,
  fetchingCards: false,
  cards: [],
  detokenizedCards: [],
  selectedCard: null,
  submitting: false,
  orderId: null,
  paymentError: false,
  paymentErrorMessage: '',
}

const checkout = createSlice({
  name: 'checkout',
  initialState: init,
  reducers: {
    setDispensaryId: (state, { payload }: PayloadAction<TInit['dispensaryId']>) => {
      state.dispensaryId = payload
    },
    setLoginModal: (state, { payload }: PayloadAction<boolean>) => {
      state.loginModal = payload
    },
    setPersonalInfo: (state, { payload }: PayloadAction<TInit['personalInfo']>) => {
      state.personalInfo = payload
    },
    setStep: (state, { payload }: PayloadAction<TInit['step']>) => {
      state.step = payload
    },
    setDeliveries: (state, { payload }: PayloadAction<TInit['deliveries']>) => {
      state.deliveries = payload
    },
    selectDelivery: (state, { payload }: PayloadAction<TInit['selectedDelivery']>) => {
      state.selectedDelivery = payload
    },
    setDeliveryAddress: (state, { payload }: PayloadAction<TInit['deliveryAddress']>) => {
      if (state.deliveryAddressRequiredError) {
        state.deliveryAddressRequiredError = false
      }
      state.deliveryAddress = payload
    },
    setDeliveryAddressRequiredError: (state, { payload }: PayloadAction<boolean>) => {
      state.deliveryAddressRequiredError = payload
    },
    setDeliveryAddressModal: (state, { payload }: PayloadAction<boolean>) => {
      state.deliveryAddressModal = payload
    },
    setDeliveryNoteForm: (state, { payload }: PayloadAction<boolean>) => {
      state.deliveryNoteForm = payload
    },
    setDeliveryNote: (state, { payload }: PayloadAction<string>) => {
      state.deliveryNote = payload
    },
    setCards: (state, { payload }: PayloadAction<TInit['cards']>) => {
      state.cards = payload
    },
    setDetokenizedCards: (
      state,
      { payload }: PayloadAction<TInit['detokenizedCards']>,
    ) => {
      state.detokenizedCards = payload
    },
    addCard: (state, { payload }: PayloadAction<TSavedCard>) => {
      state.cards = [...state.cards, payload]
    },
    setSavingCard: (state, { payload }: PayloadAction<boolean>) => {
      state.savingCard = payload
    },
    setFetchingCards: (state, { payload }: PayloadAction<boolean>) => {
      state.fetchingCards = payload
    },
    selectCard: (state, { payload }: PayloadAction<number | null>) => {
      state.selectedCard = state.cards.find((card) => card.id === payload) || null
    },
    setSubmitting: (state, { payload }: PayloadAction<boolean>) => {
      state.submitting = payload
    },
    setOrderId: (state, { payload }: PayloadAction<number>) => {
      state.orderId = payload
    },
    setPaymentError: (
      state,
      {
        payload,
      }: PayloadAction<{
        error: TInit['paymentError']
        message?: string
      }>,
    ) => {
      state.paymentError = payload.error
      if (payload.message) {
        state.paymentErrorMessage = payload.message
      }
    },
    reset: () => init,
  },
})

export const {
  setDispensaryId,
  setLoginModal,
  setPersonalInfo,
  setStep,
  setDeliveries,
  selectDelivery,
  setDeliveryAddress,
  setDeliveryAddressModal,
  setDeliveryAddressRequiredError,
  setDeliveryNoteForm,
  setDeliveryNote,
  setSavingCard,
  setFetchingCards,
  setCards,
  setDetokenizedCards,
  addCard,
  selectCard,
  setSubmitting,
  setOrderId,
  setPaymentError,
  reset,
} = checkout.actions

// all selector
export const selectCheckout: TSelector<TInit> = (state) => state.checkout

// selectors
export const selectCheckoutStep: TSelector<TInit['deliveryNote']> = (state) =>
  state.checkout.step

export const selectDeliveryNote: TSelector<TInit['deliveryNote']> = (state) =>
  state.checkout.deliveryNote

export const selectCards: TSelector<TInit['cards']> = (state) => state.checkout.cards

export const selectDetokenizedCards: TSelector<TInit['detokenizedCards']> = (state) =>
  state.checkout.detokenizedCards

export const selectSelectedCard: TSelector<TInit['selectedCard']> = (state) =>
  state.checkout.selectedCard

export const selectFetchingCards: TSelector<TInit['fetchingCards']> = (state) =>
  state.checkout.fetchingCards

export const getDeliveriesAsync = (): TAsyncAction => async (dispatch) => {
  try {
    const { data } = await apiCheckout.getDeliveries()
    dispatch(setDeliveries(data))
  } catch (e) {
    handleActionErrors({ e, dispatch })
  }
}

export const getDeliveryAddressAsync = (): TAsyncAction => async (dispatch) => {
  try {
    const { data } = await apiCheckout.getDeliveryAddress()

    dispatch(setDeliveryAddress(data))
  } catch (e) {
    handleActionErrors({ e, dispatch })
  }
}

export const saveDeliveryAddressAsync =
  ({ formData, formik }: TFormPropsAsync<TSaveDeliveryAddressReq>): TAsyncAction =>
  async (dispatch) => {
    try {
      const response = await apiCheckout.saveDeliveryAddress(formData)

      dispatch(setDeliveryAddress(response.data))
      dispatch(setDeliveryAddressModal(false))
    } catch (e) {
      handleActionErrors({ e, dispatch, formik })
    } finally {
      formik.setSubmitting(false)
    }
  }

export const savePersonalInfoAsync =
  ({ formData, formik }: TFormPropsAsync<TValidatePersonalInfoReq>): TAsyncAction =>
  async (dispatch) => {
    try {
      await apiCheckout.validatePersonalInfo(formData)
      formik.setSubmitting(false)
      dispatch(setPersonalInfo(formData))
      dispatch(setStep('payment'))
    } catch (e) {
      handleActionErrors({ e, dispatch, formik })
    }
  }

export const getCardsAsync = (): TAsyncAction => async (dispatch) => {
  try {
    dispatch(setFetchingCards(true))
    const { data } = await apiCheckout.getCards()
    dispatch(setCards(data))
  } catch (e) {
    handleActionErrors({ e, dispatch })
  } finally {
    dispatch(setFetchingCards(false))
  }
}

export const saveCardAsync =
  (data: TSaveCardReq): TAsyncAction =>
  async (dispatch) => {
    try {
      dispatch(setSavingCard(true))
      const response = await apiCheckout.saveCard(data)

      dispatch(addCard(response.data))
      dispatch(selectCard(response.data.id))
      dispatch(setStep('confirmation'))
    } catch (e) {
      handleActionErrors({ e, dispatch })
    } finally {
      dispatch(setSavingCard(false))
    }
  }

export const goToOrderConfirmation = (): TAsyncAction => async (dispatch, getState) => {
  try {
    const checkoutState = getState().checkout

    if (
      checkoutState.selectedDelivery?.isAddrRequired &&
      !checkoutState.deliveryAddress?.id
    ) {
      dispatch(setDeliveryAddressRequiredError(true))
      return
    }

    dispatch(setStep('confirmation'))
  } catch (e) {
    handleActionErrors({ e, dispatch })
  }
}

export const submitOrder =
  (data: TShoppingCartItem): TAsyncAction =>
  async (dispatch, getState) => {
    try {
      const { creditsInUse, promocode } = getState().orderSummary
      const {
        personalInfo,
        selectedDelivery,
        deliveryAddress,
        selectedCard,
        deliveryNote,
        orderId,
      } = getState().checkout

      const cart = data.products.map((product) => ({
        id: product.id,
        quantity: product.quantity,
      }))

      // TODO: add validation error
      if (!selectedDelivery || !personalInfo || !selectedCard) return

      dispatch(setSubmitting(true))

      let currentOrderId: number

      if (!orderId) {
        const createOrderRes = await apiCheckout.createOrder({
          dispensaryId: data.dispensary.id,
          cart: JSON.stringify(cart),
          firstName: personalInfo.firstName,
          lastName: personalInfo.lastName,
          phone: personalInfo.phone,
          birthDate: personalInfo.birthDate,
          deliveryId: selectedDelivery?.id,
          addressId: selectedDelivery.isAddrRequired ? deliveryAddress?.id : undefined,
          credits: creditsInUse || undefined,
          promocode: promocode?.code ?? undefined,
          deliveryNote: deliveryNote.length ? deliveryNote : undefined,
          cardId: selectedCard.id,
        })

        currentOrderId = createOrderRes.data.orderId
      } else {
        currentOrderId = orderId
      }

      dispatch(setOrderId(currentOrderId))

      const payRes = await apiCheckout.pay(currentOrderId)

      if (payRes.data.status === PAYMENT_STATUS.APPROVED) {
        dispatch(removeDispensary({ id: data.dispensary.id }))
        Router.push(ROUTES.CHECKOUT_SUCCESS)
        return
      }

      dispatch(
        setPaymentError({
          error: 'first-payment',
          message:
            "Oh no! Something went wrong with your transaction. Don't worry though, you can try again.",
        }),
      )
    } catch (e) {
      handleActionErrors({
        e,
        dispatch,
        additionalConditions: (status, data) => {
          if (status === ERROR_STATUS.MESSAGE && (data.error || data.message)) {
            dispatch(
              setPaymentError({
                error: 'first-payment',
                message: data.error || data.message,
              }),
            )
            return true
          }
        },
      })
    } finally {
      dispatch(setSubmitting(false))
    }
  }

export const checkoutPaymentTryAgain = (): TAsyncAction => async (dispatch, getState) => {
  try {
    const { orderId, dispensaryId } = getState().checkout

    if (!orderId || !dispensaryId) return

    dispatch(setSubmitting(true))

    const payRes = await apiCheckout.pay(orderId)

    if (payRes.data.status === PAYMENT_STATUS.APPROVED) {
      dispatch(removeDispensary({ id: dispensaryId }))
      Router.push(ROUTES.CHECKOUT_SUCCESS)
      return
    }

    dispatch(
      setPaymentError({
        error: 'try-again',
        message:
          "We're sorry, your transaction didn't go through again. You can head to 'Orders' to review your transaction details, or you can update your payment method in 'Checkout'.",
      }),
    )
  } catch (e) {
    handleActionErrors({
      e,
      dispatch,
      additionalConditions: (status, data) => {
        if (status === ERROR_STATUS.MESSAGE && (data.error || data.message)) {
          dispatch(
            setPaymentError({
              error: 'try-again',
              message:
                "We're sorry, your transaction didn't go through again. You can head to 'Orders' to review your transaction details, or you can update your payment method in 'Checkout'.",
            }),
          )
          return true
        }
      },
    })
  } finally {
    dispatch(setSubmitting(false))
  }
}

export default checkout.reducer
