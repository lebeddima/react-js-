import { Text } from '@/components/Text'
import { Button } from '@/components/buttons/Button'
import { CURRENCY_DOLLAR } from '@/constants/currency'
import { deviceCssQuery } from '@/styles/breakpoints'
import { formatPrice } from '@/utils/format-price'
import useTranslation from 'next-translate/useTranslation'
import styled from 'styled-components'
import { Spacer } from '@/components/Spacer'
import { TShoppingCartProduct } from '../types'
import { CannabisInfo } from './CannabisInfo'
import { MAX_CANNABIS_WEIGHT_LIMIT } from '../constants/cannabis-weight'
import { getTotalCannabisWeight } from '../utlis/get-total-cannabis-weight'

const Container = styled.div``

const Actions = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 8px;
  align-items: center;
  justify-content: center;

  @media screen and (${deviceCssQuery.sm}) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`

type TotalPriceProps = {
  totalPrice: number
  href: string
  products: TShoppingCartProduct[]
}

export const TotalPrice: React.FC<TotalPriceProps> = ({ totalPrice, products, href }) => {
  const totalCannabisWeight = getTotalCannabisWeight(products)

  const isMaxReached = totalCannabisWeight > MAX_CANNABIS_WEIGHT_LIMIT

  const { t } = useTranslation('shopping-cart')

  return (
    <Container>
      <Spacer xs={{ margin: '0 0 12px' }}>
        <CannabisInfo products={products} />
      </Spacer>
      <Actions>
        <Button disabled={isMaxReached} href={href} size="m" variant="primary">
          {t('proceed-checkout')}
        </Button>
        <Text variant="h4" color="primary700" margin="0 0 4px">
          {t('subtotal')} {CURRENCY_DOLLAR}
          {formatPrice(totalPrice)}
        </Text>
      </Actions>
    </Container>
  )
}
