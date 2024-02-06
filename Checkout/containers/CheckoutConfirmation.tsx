import { useRedux } from '@/hooks/use-redux'
import styled from 'styled-components'
import { Text } from '@/components/Text'
import useTranslation from 'next-translate/useTranslation'
import { CURRENCY_DOLLAR } from '@/constants/currency'
import { formatPrice } from '@/utils/format-price'
import { deviceCssQuery } from '@/styles/breakpoints'
import { Spacer } from '@/components/Spacer'
import { Tooltip } from '@/components/tooltips/Tooltip'
import { Button } from '@/components/buttons/Button'
import { HelpIcon } from '@/icons/Help'
import { selectCheckout, setStep, submitOrder } from '../store/checkout'
import { OrderSummaryItem } from '../components/OrderSummaryItem'
import { selectOrderSummary } from '../store/order-summary'
import { formatPhoneNumber } from '../utlis/formatPhoneNumber'
import { CreditCardInfo } from '../components/CreditCardInfo'
import { TShoppingCartItem } from '../types'

const Container = styled.div`
  padding: 32px 16px;
  max-width: 840px;
  margin: 0 auto;
  background-color: ${({ theme }) => theme.palette.base000};

  @media screen and (${deviceCssQuery.sm}) {
    border-radius: 30px;
    padding: 56px 120px;
  }
`

const PersonalInfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`

const DeliveryContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;
`

const CreditCardContainer = styled.div`
  margin-bottom: 32px;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 21px;
  margin-bottom: 16px;
`

const PriceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.base100};
  padding-bottom: 12px;
  margin-bottom: 12px;
`

const SubTotal = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Taxes = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  @media screen and (${deviceCssQuery.sm}) {
    button {
      width: 385px;
    }
  }
`

const Credits = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Total = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

const TaxesLabel = styled(Text)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

const TaxesTooltip = styled.div`
  width: 250px;
`

type Props = {
  productCart: TShoppingCartItem
}

export const CheckoutConfirmation: React.FC<Props> = ({ productCart }) => {
  const { t } = useTranslation('checkout')
  const { select, dispatch } = useRedux()
  const { creditsInUse, promocode } = select(selectOrderSummary)
  const {
    submitting,
    personalInfo,
    selectedDelivery,
    deliveryAddress,
    selectedCard,
    deliveryNote,
  } = select(selectCheckout)

  const price = productCart.products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0,
  )

  const getTotalPrice = () => {
    let totalPrice = price

    if (promocode) {
      const discount = totalPrice * (promocode.discountPercent / 100)
      const discountPrice = totalPrice - discount
      return discountPrice + (productCart.tax * discountPrice) / 100
    }

    return totalPrice + (productCart.tax * totalPrice) / 100
  }

  const getDeliveryInfo = () => {
    if (selectedDelivery?.isAddrRequired) {
      return `${deliveryAddress?.address} ${deliveryAddress?.unit}`
    }

    return productCart.dispensary.dispName
  }

  const handleMakeChangesClick = () => {
    dispatch(setStep('personal-info'))
  }

  const renderPaymentCard = () => {
    if (!selectedCard) return null

    return <CreditCardInfo data={selectedCard} />
  }

  const handleSubmitOrder = () => {
    dispatch(submitOrder(productCart))
  }

  return (
    <div>
      <Container>
        <Text variant="b2" margin="0 0 24px">
          {t('confirmation.title')}
        </Text>
        <Text variant="h4" margin="0 0 16px">
          {t('confirmation.personal-info')}
        </Text>
        <PersonalInfoContainer>
          <Text variant="b3">
            {personalInfo?.firstName} {personalInfo?.lastName}
          </Text>
          <Text variant="b3">{personalInfo?.birthDate}</Text>
        </PersonalInfoContainer>
        <Text variant="b3" margin="0 0 32px">
          {formatPhoneNumber(personalInfo?.phone || '')}
        </Text>
        <Text variant="h4" margin="0 0 16px">
          {t('confirmation.delivery')}
        </Text>
        <DeliveryContainer>
          <Text variant="b3">{getDeliveryInfo()}</Text>
          <Text variant="b3">{selectedDelivery?.name}</Text>
        </DeliveryContainer>
        {deliveryNote && (
          <Spacer xs={{ margin: '0 0 32px' }}>
            <Text variant="h4" margin="0 0 16px">
              Delivery instructions
            </Text>
            <Text variant="b3" margin="0 0 16px">
              {deliveryNote}
            </Text>
          </Spacer>
        )}
        {selectedCard && (
          <>
            <Text variant="h4" margin="0 0 16px">
              {t('confirmation.payment')}
            </Text>
            <CreditCardContainer>{renderPaymentCard()}</CreditCardContainer>
          </>
        )}
        <Text variant="h4" margin="0 0 16px">
          {t('confirmation.order-summary')}
        </Text>
        <List>
          {productCart.products.map((product) => (
            <OrderSummaryItem key={product.id} data={product} />
          ))}
        </List>
        <PriceInfo>
          <SubTotal>
            <Text variant="b5">{t('order-summary.subtotal')}</Text>
            <Text variant="b4">
              {CURRENCY_DOLLAR}
              {formatPrice(price)}
            </Text>
          </SubTotal>
          {creditsInUse > 0 ? (
            <Credits>
              <Text variant="b5">{t('order-summary.credits')}</Text>
              <Text variant="b4">
                {t('order-summary.minus-sign')}
                {CURRENCY_DOLLAR}
                {formatPrice(creditsInUse)}
              </Text>
            </Credits>
          ) : null}
          {promocode && (
            <Credits>
              <Text variant="b5">{t('order-summary.promocode-discount')}</Text>
              <Text variant="b4">{promocode.discountPercent}%</Text>
            </Credits>
          )}
          <Taxes>
            <Tooltip
              position="right center"
              on="hover"
              trigger={
                <TaxesLabel variant="b5">
                  {t('order-summary.taxes')}
                  <HelpIcon />
                </TaxesLabel>
              }
              renderMenu={() => (
                <TaxesTooltip style={{ width: '300px' }}>
                  <Text variant="b5">Taxes Included: HST ({productCart.tax}%)</Text>
                </TaxesTooltip>
              )}
              maxWidth="230px"
            />
            <Text variant="b4">
              {CURRENCY_DOLLAR}
              {formatPrice((price * productCart.tax) / 100)}
            </Text>
          </Taxes>
        </PriceInfo>
        <Total>
          <Text variant="h4" color="primary700">
            {t('order-summary.total')}
          </Text>
          <Text variant="h4" color="primary700">
            {CURRENCY_DOLLAR}
            {formatPrice(getTotalPrice())}
          </Text>
        </Total>
        <Actions>
          <Button
            variant="primary"
            width="100%"
            size="l"
            loading={submitting}
            onClick={handleSubmitOrder}
          >
            {t('confirmation.submit')}
          </Button>
          <Button
            variant="tertiary-2"
            width="100%"
            size="l"
            onClick={handleMakeChangesClick}
          >
            {t('confirmation.make-changes')}
          </Button>
        </Actions>
      </Container>
    </div>
  )
}
