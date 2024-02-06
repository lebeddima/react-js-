import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useRedux } from '@/hooks/use-redux'
import { Button } from '@/components/buttons/Button'
import { RadioButton } from '@/inputs/Radio/Radio'
import { Skeleton } from '@/components/Skeleton'
import { Text } from '@/components/Text'
import { CreditCardIcon } from '@/icons/CreditCard'
import { useResolution } from '@/hooks/use-resolution'
import useTranslation from 'next-translate/useTranslation'
import { NewCreditCardForm } from './NewCreditCardForm'
import { TSavedCard } from '../types'
import {
  goToOrderConfirmation,
  selectCard,
  selectCards,
  selectFetchingCards,
  selectSelectedCard,
} from '../store/checkout'
import { CreditCardInfo } from '../components/CreditCardInfo'

const Container = styled.div`
  max-width: 385px;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 24px;
`

const RadioContainer = styled.div`
  display: flex;
  align-items: center;
`

const SkeletonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const SkeletonItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`

const NewCardLabel = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`

export const PaymentDetails: React.FC = () => {
  const { t } = useTranslation('checkout')
  const { select, dispatch } = useRedux()
  const { biggerThan } = useResolution({ enable: true })
  const [newCardForm, setNewCardForm] = useState<boolean>(false)

  const cards = select(selectCards)
  const selectedCard = select(selectSelectedCard)
  const fetchingCards = select(selectFetchingCards)

  useEffect(() => {
    // select first card if there are cards and none is selected
    if (fetchingCards) return
    if (!cards.length) return
    if (selectedCard) return
    if (newCardForm) return

    dispatch(selectCard(cards[0].id))
  }, [fetchingCards, cards.length, selectedCard, newCardForm])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedCardId = Number(e.target.value)
    if (newCardForm) {
      setNewCardForm(false)
    }
    dispatch(selectCard(selectedCardId))
  }

  const openNewCardForm = () => {
    if (selectedCard) {
      dispatch(selectCard(null))
    }

    setNewCardForm(true)
  }

  const handleSumit = () => {
    dispatch(goToOrderConfirmation())
  }

  const renderCardOption = (card: TSavedCard) => {
    const { id } = card

    return (
      <RadioContainer key={id}>
        <RadioButton
          value={id}
          name={`${card}-${id}`}
          label={<CreditCardInfo data={card} />}
          onChange={handleChange}
          checked={id === selectedCard?.id}
        />
      </RadioContainer>
    )
  }

  const showCards = !fetchingCards

  if (!showCards)
    return (
      <div>
        <Text variant="h4" margin="0 0 16px">
          {t('payment-details.title')}
        </Text>
        <SkeletonList>
          {cards.map((card) => (
            <SkeletonItem key={card.id}>
              <Skeleton width="216px" height="26px" />
              {/* <Skeleton width="60px" height="18px" /> */}
            </SkeletonItem>
          ))}
        </SkeletonList>
      </div>
    )

  const isDesktop = biggerThan('sm')

  return (
    <Container>
      <Text variant="h4" margin="0 0 16px">
        {t('payment-details.title')}
      </Text>
      <List>
        {cards.map((card) => renderCardOption(card))}
        <RadioButton
          value="new"
          name="new-card"
          label={
            <NewCardLabel>
              <Text variant="b3">{t('payment-details.add-new-card')}</Text>
              <CreditCardIcon color="base700" />
            </NewCardLabel>
          }
          onChange={openNewCardForm}
          checked={newCardForm}
        />
      </List>
      {!newCardForm && showCards && cards.length > 0 && (
        <Button onClick={handleSumit} size="l" variant="primary" width="100%">
          {t('confirm')}
        </Button>
      )}
      {newCardForm && isDesktop !== null && (
        <NewCreditCardForm key={`skyflow-form-${isDesktop}`} isDesktop={isDesktop} />
      )}
    </Container>
  )
}
