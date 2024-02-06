import { Text } from '@/components/Text'
import styled from 'styled-components'
import { VisaIcon } from '@/icons/Visa'
import { MasterCardIcon } from '@/icons/MasterCard'
import { formatCardNumber } from '../utlis/formatCardNumber'
import { TSavedCard } from '../types'

type TProps = {
  data: TSavedCard
}

const Container = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`

export const CreditCardInfo: React.FC<TProps> = ({ data }) => {
  const { number, isMasterCard, isVisa } = data

  const renderCardIcon = () => {
    if (isMasterCard) return <MasterCardIcon />
    if (isVisa) return <VisaIcon />
    return null
  }

  return (
    <Container>
      <Text variant="b3">{formatCardNumber(number)}</Text>
      {renderCardIcon()}
    </Container>
  )
}
