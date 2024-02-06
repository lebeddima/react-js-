import styled from 'styled-components'
import { deviceCssQuery } from '@/styles/breakpoints'
import { Text } from '@/components/Text'
import { Button } from '@/components/buttons/Button'
import { CURRENCY_DOLLAR } from '@/constants/currency'
import { formatPrice } from '@/utils/format-price'
import { useAuth } from '@/hooks/use-auth'
import { useRedux } from '@/hooks/use-redux'
import { Tooltip } from '@/components/tooltips/Tooltip'
import useTranslation from 'next-translate/useTranslation'
import { HelpIcon } from '@/icons/Help'
import { AlertIcon } from '@/icons/Alert'
import { useShoppingCart } from '../hooks/use-shopping-cart'
import { ShoppingCartItem } from '../components/ShoppingCartItem'
import { StoreItem } from '../components/StoreItem'
import { CreditsModal } from '../components/CreditsModal'
import { selectOrderSummary, setPromocodeModal } from '../store/order-summary'
import { PromocodeModal } from './PromocodeModal'
import { TShoppingCartItem } from '../types'
import { CannabisInfo } from '../components/CannabisInfo'
import { getTotalCannabisWeight } from '../utlis/get-total-cannabis-weight'
import { MAX_CANNABIS_WEIGHT_LIMIT } from '../constants/cannabis-weight'

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.palette.base000};
  overflow: hidden;

  @media screen and (${deviceCssQuery.sm}) {
    border-radius: 30px;
    max-height: 714px;
    overflow: hidden;
    max-height: 716px;
  }
`

const Header = styled.header`
  order: 1;
`

const List = styled.div`
  padding: 16px 16px 24px;
  flex-grow: 1;
  order: 3;

  @media screen and (${deviceCssQuery.sm}) {
    min-height: 250px;
    order: 2;
    padding: 16px 32px;
    max-height: 100%;
    overflow-y: auto;
  }
`

const Title = styled(Text)`
  padding: 32px 16px 16px;

  @media screen and (${deviceCssQuery.sm}) {
    padding: 24px 32px 16px;
  }
`

const Footer = styled.div`
  order: 2;
  margin-top: auto;
  padding: 16px;
  box-shadow: 0px 4px 15px rgba(224, 220, 222, 0.3);

  background-color: ${({ theme }) => theme.palette.base000};

  @media screen and (${deviceCssQuery.sm}) {
    padding: 16px 32px;
    order: 3;
    box-shadow: -4px -4px 15px rgba(94, 91, 92, 0.15);
  }
`

const Info = styled.div`
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
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media screen and (${deviceCssQuery.sm}) {
    justify-content: flex-start;
  }
`

const Total = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Credits = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const TaxesLabel = styled(Text)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`

const TaxesTooltip = styled.div`
  width: 250px;
`

const CannabisInfoContainer = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 16px;
  background-color: ${({ theme }) => theme.palette.primary100};

  @media screen and (${deviceCssQuery.sm}) {
    padding: 16px 32px;
  }

  > div:last-child {
    flex-grow: 1;
  }
`

type Props = {
  productCart: TShoppingCartItem
}

export const OrderSummary: React.FC<Props> = ({ productCart }) => {
  const { t } = useTranslation('checkout')
  const { select, dispatch } = useRedux()
  const { user } = useAuth()
  const { updateProduct, removeProduct } = useShoppingCart()
  const { promocode } = select(selectOrderSummary)

  const handleChange = (productId: number, newQuantity: number) => {
    updateProduct(productId, newQuantity)
  }

  const handleDelete = (productId: number) => {
    removeProduct(productId)
  }

  const handleUsePromocodeClick = () => {
    dispatch(setPromocodeModal(true))
  }

  // const handleUseCreditsClick = () => {
  //   dispatch(setCreditsModal(true))
  // }

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

  const totalCannabisWeight = getTotalCannabisWeight(productCart.products)

  const isMaxReached = totalCannabisWeight > MAX_CANNABIS_WEIGHT_LIMIT

  return (
    <>
      <CreditsModal />
      <PromocodeModal />
      <Container>
        <Header>
          <Title variants={{ xs: 'h4', sm: 'h3' }}>{t('order-summary.title')}</Title>
          <StoreItem data={productCart.dispensary} />
          {isMaxReached && (
            <CannabisInfoContainer>
              <AlertIcon color="primary700" />
              <CannabisInfo products={productCart.products} />
            </CannabisInfoContainer>
          )}
        </Header>
        <List>
          {productCart.products.map((product) => (
            <ShoppingCartItem
              key={product.id}
              product={product}
              onChange={handleChange}
              onDelete={handleDelete}
            />
          ))}
        </List>
        <Footer>
          <Info>
            <SubTotal>
              <Text variant="b5">{t('order-summary.subtotal')}</Text>
              <Text variant="b4">
                {CURRENCY_DOLLAR}
                {formatPrice(price)}
              </Text>
            </SubTotal>
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
            <Actions>
              <Button
                disabled={!user}
                variant="tertiary-2"
                onClick={handleUsePromocodeClick}
              >
                {t('order-summary.add-promocode')}
              </Button>
              {/* <Divider />
              <Button
                variant="tertiary-2"
                disabled={!user?.credits}
                onClick={handleUseCreditsClick}
              >
                {t('order-summary.use-credits')}
              </Button> */}
            </Actions>
          </Info>
          <Total>
            <Text variant="h4" color="primary700">
              {t('order-summary.total')}
            </Text>
            <Text variant="h4" color="primary700">
              {CURRENCY_DOLLAR}
              {formatPrice(getTotalPrice())}
            </Text>
          </Total>
        </Footer>
      </Container>
    </>
  )
}
