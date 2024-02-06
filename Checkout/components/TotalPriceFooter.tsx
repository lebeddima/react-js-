import { Text } from '@/components/Text'
import { Button } from '@/components/buttons/Button'
import { CURRENCY_DOLLAR } from '@/constants/currency'
import { deviceCssQuery } from '@/styles/breakpoints'
import { formatPrice } from '@/utils/format-price'
import { Spacer } from '@/components/Spacer'
import useTranslation from 'next-translate/useTranslation'
import styled from 'styled-components'
import { TShoppingCartProduct } from '../types'
import { CannabisInfo } from './CannabisInfo'
import { getTotalCannabisWeight } from '../utlis/get-total-cannabis-weight'
import { MAX_CANNABIS_WEIGHT_LIMIT } from '../constants/cannabis-weight'

const Footer = styled.div`
  display: none;

  @media screen and (${deviceCssQuery.sm}) {
    display: block;
    position: relative;
    margin-top: auto;
    box-shadow: 4px -4px 15px rgba(94, 91, 92, 0.15);
    padding: 24px 32px;
    background-color: ${({ theme }) => theme.palette.base000};
  }
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const PriceInfo = styled.div`
  text-align: right;
`

type TotalPriceFooterProps = {
  price: number
  href: string
  products?: TShoppingCartProduct[]
}

export const TotalPriceFooter: React.FC<TotalPriceFooterProps> = ({
  price,
  href,
  products = [],
}) => {
  const { t } = useTranslation('shopping-cart')

  const totalCannabisWeight = getTotalCannabisWeight(products)

  const isMaxReached = totalCannabisWeight > MAX_CANNABIS_WEIGHT_LIMIT

  return (
    <Footer>
      <Spacer xs={{ margin: '0 0 12px' }}>
        <CannabisInfo products={products} />
      </Spacer>
      <Actions>
        <Button href={href} size="l" variant="primary" disabled={isMaxReached}>
          {t('proceed-checkout')}
        </Button>
        <PriceInfo>
          <Text variant="h4" color="primary700" margin="0 0 4px">
            {t('subtotal')} {CURRENCY_DOLLAR}
            {formatPrice(price)}
          </Text>
          <Text variant="d1">{t('tax-info')} </Text>
        </PriceInfo>
      </Actions>
    </Footer>
  )
}
