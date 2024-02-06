import styled from 'styled-components'
import { deviceCssQuery } from '@/styles/breakpoints'
import { BaseImage } from '@/components/BaseImage'
import { Text } from '@/components/Text'
import { CURRENCY_DOLLAR } from '@/constants/currency'
import { formatPrice } from '@/utils/format-price'
import { pluralizeEn } from '@/utils/pluralize-en'
import { TShoppingCartProduct } from '../types'

type OrderSummaryItemProps = {
  data: TShoppingCartProduct
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 21px;
  border-bottom: 1px solid ${({ theme }) => theme.palette.base100};
`

const ImageCont = styled.div`
  display: none;
  width: 60px;
  height: 60px;
  position: relative;
  flex-shrink: 0;

  @media screen and (${deviceCssQuery.sm}) {
    display: block;
  }
`

const ContentContainer = styled.div`
  flex-grow: 1;
  overflow: hidden;
`

const Name = styled(Text)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Labels = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
`

const Dot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.palette.secondary500};
`

const PriceContainer = styled.div`
  flex-shrink: 0;
  margin-left: 24px;
  text-align: right;
`

export const OrderSummaryItem: React.FC<OrderSummaryItemProps> = ({ data }) => {
  const { brandName, measure, name, photo, price, quantity } = data

  return (
    <Container>
      <ImageCont>
        <BaseImage alt={name} src={photo} layout="fill" objectFit="contain" />
      </ImageCont>
      <ContentContainer>
        <Name variant="b4">{name}</Name>
        <Labels>
          <Text variant="d2" color="base700">
            {brandName}
          </Text>
          {measure && (
            <>
              <Dot />
              <Text variant="d2" color="base700">
                {measure}
              </Text>
            </>
          )}
          <Dot />
          <Text variant="d2" color="base700">
            {pluralizeEn(quantity, 'item')}
          </Text>
        </Labels>
      </ContentContainer>
      <PriceContainer>
        <Text variant="b5" color="base500" margin="0 0 4px">
          Total Price:
        </Text>
        <Text variant="b4">{`${CURRENCY_DOLLAR}${formatPrice(price * quantity)}`}</Text>
      </PriceContainer>
    </Container>
  )
}
