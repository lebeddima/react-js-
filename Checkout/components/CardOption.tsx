import { RevealElement, useMakeSkyflowStyles, useRevealContainer } from 'skyflow-react-js'
import SkyFlow from 'skyflow-js'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Skeleton } from '@/components/Skeleton'
import { TSavedCard } from '../types'

type TProps = {
  data: TSavedCard
}

const Container = styled.div`
  height: 26px;
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

const SkeletonContainer = styled.div`
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
`

export const CardOption: React.FC<TProps> = ({ data }) => {
  const revealContainer = useRevealContainer()
  const [loading, setLoading] = useState(true)

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

  return (
    <Container>
      <RevealElement
        id={`card-number-${data.id}`}
        token={data.number}
        container={revealContainer}
        classes={classes}
        redaction={SkyFlow.RedactionType.MASKED}
      />
      {loading && (
        <SkeletonContainer>
          <Skeleton width="216px" height="26px" />
        </SkeletonContainer>
      )}
    </Container>
  )
}
