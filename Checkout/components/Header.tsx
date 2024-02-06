import { Text } from '@/components/Text'
import { Button } from '@/components/buttons/Button'
import { AlertIcon } from '@/icons/Alert'
import { CloseIcon } from '@/icons/Close'
import { deviceCssQuery } from '@/styles/breakpoints'
import useTranslation from 'next-translate/useTranslation'
import styled from 'styled-components'
import { formatPrice } from '@/utils/format-price'
import { CURRENCY_DOLLAR } from '@/constants/currency'
import { ROUTES } from '@/constants/routes'
import { StoreItem } from './StoreItem'
import { useShoppingCart } from '../hooks/use-shopping-cart'
import { CannabisInfo } from './CannabisInfo'
import { getTotalCannabisWeight } from '../utlis/get-total-cannabis-weight'
import { MAX_CANNABIS_WEIGHT_LIMIT } from '../constants/cannabis-weight'

const Container = styled.div``

const Subtitle = styled(Text)`
  display: none;
  @media screen and (${deviceCssQuery.sm}) {
    display: inline-block;
  }
`

const HeadingContainer = styled.div`
  padding: 16px 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media screen and (${deviceCssQuery.sm}) {
    padding: 16px 32px;
  }
`

const WarningAlert = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
  padding: 10px 16px;
  background-color: ${({ theme }) => theme.palette.primary100};

  @media screen and (${deviceCssQuery.sm}) {
    padding: 16px 32px;
  }
`

const SubtotalContainer = styled.div`
  padding: 16px 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.base100};

  @media screen and (${deviceCssQuery.sm}) {
    display: none;
  }
`

const AlignCenter = styled.div`
  text-align: center;
`

export const Header: React.FC = () => {
  const { cart, close } = useShoppingCart()
  const { t } = useTranslation('shopping-cart')

  const totalCannabisWeight =
    cart.length === 1 ? getTotalCannabisWeight(cart[0].products) : 0

  const isMaxReached = totalCannabisWeight > MAX_CANNABIS_WEIGHT_LIMIT

  const handleCLose = () => {
    close()
  }

  return (
    <Container>
      <HeadingContainer>
        <div>
          <Text variants={{ xs: 'h4', sm: 'h3' }}>{t('title')}</Text>
          {cart.length === 1 && (
            <Subtitle variant="b5">
              {t('subtotal')} {CURRENCY_DOLLAR}
              {formatPrice(cart[0].total)}
            </Subtitle>
          )}
        </div>
        <Button
          size="s"
          variant="secondary"
          startIcon={<CloseIcon />}
          onClick={handleCLose}
        >
          {t('close')}
        </Button>
      </HeadingContainer>
      {cart.length > 1 && (
        <WarningAlert>
          <AlertIcon color="primary700" />
          <Text variant="b4">{t('warning-alert')}</Text>
        </WarningAlert>
      )}
      {cart.length === 1 && <StoreItem data={cart[0].dispensary} />}
      {cart.length === 1 && (
        <SubtotalContainer>
          <CannabisInfo products={cart[0].products} />
          <AlignCenter>
            <Text variant="h4" color="primary700" margin="0 0 4px">
              {t('subtotal')} {CURRENCY_DOLLAR}
              {formatPrice(cart[0].total)}
            </Text>
            <Text variant="d2" margin="0 0 8px">
              {t('tax-info')}{' '}
            </Text>
            <Button
              href={`${ROUTES.CHECKOUT}?dispensaryId=${cart[0].dispensary.id}`}
              size="l"
              variant="primary"
              disabled={isMaxReached}
            >
              {t('proceed-checkout')}
            </Button>
          </AlignCenter>
        </SubtotalContainer>
      )}
    </Container>
  )
}
