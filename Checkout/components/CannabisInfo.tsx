import styled from 'styled-components'
import { Text } from '@/components/Text'
import { AlertIcon } from '@/icons/Alert'
import { HelpIcon } from '@/icons/Help'
import { TShoppingCartProduct } from '../types'
import { MAX_CANNABIS_WEIGHT_LIMIT } from '../constants/cannabis-weight'
import { getTotalCannabisWeight } from '../utlis/get-total-cannabis-weight'

const Container = styled.div``

const CannabisInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`

const ToolTip = styled.div`
  pointer-events: none;
  opacity: 0;
  transform: translateY(5px);
  transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
  width: 250px;
  position: absolute;
  bottom: 120%;
  right: -7%;
  background: ${({ theme }) => theme.palette.base000};
  border-radius: 20px;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.palette.base100};
  box-shadow: 0px 4px 15px rgba(224, 220, 222, 0.3);

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 6%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: ${({ theme }) => theme.palette.base000} transparent transparent
      transparent;
  }
`

const GramLimit = styled(Text)`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;

  &:hover,
  &:focus {
    ${ToolTip} {
      opacity: 1;
      transform: translateY(0);
      pointer-events: all;
    }
  }
`

type TProps = {
  products: TShoppingCartProduct[]
}

export const CannabisInfo: React.FC<TProps> = ({ products }) => {
  const totalCannabisWeight = getTotalCannabisWeight(products)

  const isMaxReached = totalCannabisWeight > MAX_CANNABIS_WEIGHT_LIMIT
  const difference = (totalCannabisWeight - MAX_CANNABIS_WEIGHT_LIMIT).toFixed(1)

  const renderTooltip = () => {
    if (isMaxReached) {
      return (
        <ToolTip className="tooltip">
          <Text variant="d1" margin="0 0 8px">
            MAX LIMIT EXCEEDED
          </Text>
          <Text variant="d2">
            Bag contents have exceeded the maximum cannabis limit. Remove items from
            shopping cart before proceeding to checkout.
          </Text>
        </ToolTip>
      )
    }

    return (
      <ToolTip className="tooltip">
        <Text variant="d1" margin="0 0 8px">
          GRAMS OF CANNABIS
        </Text>
        <Text variant="d2">
          There is a maximum limit of {MAX_CANNABIS_WEIGHT_LIMIT}g cannabis per order.
          Checkout will not be permitted if your order exceeds this limit.
        </Text>
      </ToolTip>
    )
  }

  const renderCannabisInfoIcon = () => {
    if (isMaxReached) {
      return <AlertIcon size="s" color="base500" />
    }

    return <HelpIcon />
  }

  return (
    <Container>
      <CannabisInfoContainer>
        <Text variant="b4">GRAMS OF CANNABIS</Text>
        <GramLimit variant="b4">
          <span>
            {totalCannabisWeight.toFixed(1)} / {MAX_CANNABIS_WEIGHT_LIMIT.toFixed(1)}g
            limit
          </span>
          {renderCannabisInfoIcon()}
          {renderTooltip()}
        </GramLimit>
      </CannabisInfoContainer>
      {isMaxReached && (
        <Text variant="d2">
          You are {difference}g over your {MAX_CANNABIS_WEIGHT_LIMIT}g MAX LIMIT.
        </Text>
      )}
    </Container>
  )
}
