import styled from 'styled-components'
import { BaseImage } from '@/components/BaseImage'
import { Text } from '@/components/Text'
import { Price } from '@/components/Price'
import { NumberInput } from '@/inputs/NumberInput/NumberInput'
import { ButtonIcon } from '@/components/buttons/ButtonIcon'
import { deviceCssQuery } from '@/styles/breakpoints'
import { TrashIcon } from '@/icons/Trash'
import { BaseLink } from '@/components/links/BaseLink'
import { ROUTES } from '@/constants/routes'
import { TShoppingCartProduct } from '../types'

const Container = styled.div`
  display: flex;
  gap: 19px;
  align-items: center;
  padding-bottom: 16px;

  &:not(:last-child) {
    margin-bottom: 16px;
    border-bottom: 1px solid ${({ theme }) => theme.palette.base100};
  }
`

const ImageCont = styled.div`
  display: none;
  width: 88px;
  height: 87px;
  position: relative;
  flex-shrink: 0;

  @media screen and (${deviceCssQuery.sm}) {
    display: block;
  }
`

const ContentContainer = styled.div`
  flex-grow: 1;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`

const Name = styled(Text)`
  margin-right: 24px;
  max-width: 328px;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.palette.primary700};
  }
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

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

type ShoppingCartItemProps = {
  product: TShoppingCartProduct
  onChange: (productId: number, value: number) => void
  onDelete: (productId: number) => void
}

export const ShoppingCartItem: React.FC<ShoppingCartItemProps> = ({
  product,
  onChange,
  onDelete,
}) => {
  const { id, name, brandName, price, photo, measure, quantity } = product

  const handleQuantityChange = (newQuantity: number) => {
    onChange(id, newQuantity)
  }

  const handleDelete = () => {
    onDelete(id)
  }

  return (
    <Container>
      <ImageCont>
        <BaseImage alt={name} src={photo} layout="fill" objectFit="contain" />
      </ImageCont>
      <ContentContainer>
        <Header>
          <BaseLink href={`${ROUTES.PRODUCT}/${product.uri}`}>
            <Name variant="b2">{name}</Name>
          </BaseLink>
          <ButtonIcon
            type="button"
            variant="primary"
            size="l"
            width="32px"
            height="32px"
            iconColor="base700"
            icon={() => <TrashIcon size="s" />}
            onClick={handleDelete}
          />
        </Header>
        <Labels>
          <Text variant="d2">{brandName}</Text>
          {measure && (
            <>
              <Dot />
              <Text variant="d2">{measure}</Text>
            </>
          )}
        </Labels>
        <Footer>
          <NumberInput
            size="s"
            value={quantity}
            min={1}
            onChange={handleQuantityChange}
          />
          <Price price={price * quantity} priceVariant="h4" />
        </Footer>
      </ContentContainer>
    </Container>
  )
}
