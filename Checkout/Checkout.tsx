import { CardWrapper } from '@/components/cards/CardWrapper'
import styled from 'styled-components'
import { useEffect } from 'react'
import { deviceCssQuery } from '@/styles/breakpoints'
import { useAuth } from '@/hooks/use-auth'
import { useBrowserAlert } from '@/hooks/use-browser-alert'
import { useRedux } from '@/hooks/use-redux'
import { OrderSummary } from './containers/OrderSummary'
import {
  setDispensaryId,
  getCardsAsync,
  getDeliveriesAsync,
  getDeliveryAddressAsync,
  selectCheckoutStep,
  reset,
} from './store/checkout'
import { CheckoutPersonalInfoStep } from './containers/CheckoutPersonalInfoStep'
import { CheckoutPaymentStep } from './containers/CheckoutPaymentStep'
import { CheckoutConfirmation } from './containers/CheckoutConfirmation'
import { useShoppingCart } from './hooks/use-shopping-cart'
import { EmptyCart } from './components/EmptyCart'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media screen and (${deviceCssQuery.sm}) {
    flex-direction: row;
    align-items: flex-start;
    gap: 40px;

    > div {
      flex: 1;
    }
  }
`

type TCheckoutProps = { dispensaryId: number }

export const Checkout: React.FC<TCheckoutProps> = ({ dispensaryId }) => {
  const { select, dispatch } = useRedux()
  const { user } = useAuth()

  const step = select(selectCheckoutStep)
  const { cart } = useShoppingCart()

  useBrowserAlert()

  useEffect(() => {
    dispatch(setDispensaryId(dispensaryId))
  }, [])

  useEffect(() => {
    if (!user) return

    dispatch(getDeliveriesAsync())
    dispatch(getDeliveryAddressAsync())
    dispatch(getCardsAsync())
  }, [user])

  useEffect(
    () => () => {
      dispatch(reset())
    },
    [],
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [step, user?.id])

  if (step === 'success') return <CheckoutConfirmation productCart={cart[0]} />

  const productCart = cart.find((item) => item.dispensary.id === dispensaryId)

  if (!productCart) return <EmptyCart />

  if (!productCart.products.length) return <EmptyCart />

  if (step === 'confirmation') return <CheckoutConfirmation productCart={productCart} />

  return (
    <Container>
      <CardWrapper xs={{ borderRadius: '0' }} sm={{ borderRadius: '30px' }}>
        {step === 'personal-info' ? (
          <CheckoutPersonalInfoStep productCart={productCart} />
        ) : (
          <CheckoutPaymentStep />
        )}
      </CardWrapper>
      <OrderSummary productCart={productCart} />
    </Container>
  )
}
