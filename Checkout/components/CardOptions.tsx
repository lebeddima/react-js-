import { RevealElement, useMakeSkyflowStyles, useRevealContainer } from 'skyflow-react-js'
import SkyFlow from 'skyflow-js'
import { useRedux } from '@/hooks/use-redux'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Skeleton } from '@/components/Skeleton'
import { RadioButton } from '@/inputs/Radio/Radio'
import { TSavedCard } from '../types'

import { selectCard, selectFetchingCards, selectSelectedCard } from '../store/checkout'

type TProps = {
  cards: TSavedCard[]
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const RadioContainer = styled.div`
  display: flex;
  align-items: center;
`

const Container = styled.div`
  overflow-y: hidden;
  position: relative;

  iframe {
    height: 26px !important;
  }
`

const cardNumberStyles = {
  inputStyles: {
    base: {
      color: '#1F1018',
      padding: '0px',
      fontFamily: 'Helvetica',
      fontSize: '16px',
    },
    copyIcon: {
      position: 'absolute',
      right: '8px',
      top: 'calc(50% - 10px)',
    },
  },
  labelStyles: {
    base: {
      fontSize: '16px',
      fontFamily: 'Helvetica',
      fontWeight: 'normal',
      lineheight: '26px',
      color: 'red',
    },
  },
  errorTextStyles: {
    base: {
      color: 'red',
    },
  },
} as Record<string, unknown>

const SkeletonItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;
`

export const CardOptions: React.FC<TProps> = ({ cards, onChange }) => {
  const revealContainer = useRevealContainer()
  const { select, dispatch } = useRedux()
  const [loading, setLoading] = useState(true)

  const selectedCard = select(selectSelectedCard)
  const fetchingCards = select(selectFetchingCards)

  useEffect(() => {
    // select first card if there are cards and none is selected
    if (fetchingCards) return
    if (!cards.length) return
    if (selectedCard) return

    dispatch(selectCard(cards[0].id))
  }, [fetchingCards, cards.length, selectedCard])

  const useStyles = useMakeSkyflowStyles(cardNumberStyles)

  const classes = useStyles()

  useEffect(() => {
    revealContainer
      .reveal()
      .then(() => {
        // Show card number.
      })
      .catch(() => {
        // Handle error.
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const LoadingState = cards.map((card) => (
    <SkeletonItem key={card.id}>
      <Skeleton width="216px" height="26px" />
    </SkeletonItem>
  ))

  return (
    <Container>
      {loading && LoadingState}
      <List>
        {cards.map((card) => (
          <RadioContainer key={card.id}>
            <RadioButton
              value={card.id}
              name={card.number}
              label={
                <RevealElement
                  key={card.id}
                  id={`card-number-${card.id}`}
                  token={card.number}
                  container={revealContainer}
                  classes={classes}
                  redaction={SkyFlow.RedactionType.MASKED}
                />
              }
              onChange={onChange}
              checked={card.id === selectedCard?.id}
            />
          </RadioContainer>
        ))}
      </List>
    </Container>
  )
}
