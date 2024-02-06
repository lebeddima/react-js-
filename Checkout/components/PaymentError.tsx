import { Text } from '@/components/Text'
import { CardWrapper } from '@/components/cards/CardWrapper'
import { ModalBase } from '@/components/modals/ModalBase'
import { HeaderText } from '@/components/HeaderText'
import { useRedux } from '@/hooks/use-redux'
import styled from 'styled-components'
import { Button } from '@/components/buttons/Button'
import { ROUTES } from '@/constants/routes'
import {
  checkoutPaymentTryAgain,
  selectCheckout,
  setPaymentError,
  setStep,
} from '../store/checkout'

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const PaymentError: React.FC = () => {
  const { select, dispatch } = useRedux()
  const { submitting, paymentError, paymentErrorMessage } = select(selectCheckout)

  if (!paymentError) return null

  const handleClose = () => {
    dispatch(setPaymentError({ error: false, message: '' }))
  }

  const handleTryAgain = () => {
    dispatch(checkoutPaymentTryAgain())
  }

  const handleChangesClick = () => {
    dispatch(setPaymentError({ error: false, message: '' }))
    dispatch(setStep('payment'))
  }

  const renderActions = () => {
    if (paymentError === 'first-payment') {
      return (
        <Actions>
          <Button
            loading={submitting}
            size="l"
            onClick={handleTryAgain}
            variant="primary"
            width="100%"
          >
            Try again
          </Button>
          <Button
            disabled={submitting}
            size="l"
            variant="secondary"
            width="100%"
            onClick={handleClose}
          >
            Cancel
          </Button>
        </Actions>
      )
    }

    return (
      <Actions>
        <Button
          href={ROUTES.ORDERS}
          size="l"
          onClick={handleClose}
          variant="primary"
          width="100%"
        >
          View my Orders
        </Button>
        <Button
          disabled={submitting}
          size="l"
          variant="secondary"
          width="100%"
          onClick={handleChangesClick}
        >
          Make Changes
        </Button>
      </Actions>
    )
  }

  return (
    <ModalBase open maxWidth="488px" onClose={handleClose}>
      <CardWrapper xs={{ padding: '40px 24px' }} sm={{ padding: '40px' }} border>
        <HeaderText
          align="center"
          margin="0 0 16px"
          mainText="Error"
          secondText="!"
          tag="h1"
          variant="h3"
        />
        <Text margin="0 0 24px" align="center" variant="b3">
          {paymentErrorMessage}
        </Text>
        {renderActions()}
      </CardWrapper>
    </ModalBase>
  )
}
