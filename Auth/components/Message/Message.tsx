import useTranslation from 'next-translate/useTranslation'
import { FC } from 'react'
import { Header, THeader } from '@/components/modals/Header'
import { Button } from '@/components/buttons/Button'
import { Spacer } from '@/components/Spacer'
import { CardWrapper } from '@/components/cards/CardWrapper'
import styled from 'styled-components'

type TMessage = {
  buttonLabel?: string
  isLoading?: boolean
  onClickButton?: () => void
  maxWidth?: string
} & THeader

const Container = styled(CardWrapper)`
  width: 100%;
  margin: 0 auto;
`

export const Message: FC<TMessage> = ({
  buttonLabel,
  isLoading,
  maxWidth = '592px',
  onClickButton,
  ...props
}) => {
  const { t } = useTranslation('modal')

  return (
    <Container
      maxWidth={maxWidth}
      xs={{ padding: '24px' }}
      sm={{ padding: '40px' }}
      border
    >
      <Header {...props} />

      <Spacer xs={{ margin: '24px 0 0 0' }}>
        <Button
          variant="primary"
          size="l"
          isLoading={isLoading}
          type="button"
          onClick={onClickButton}
          width="100%"
        >
          {buttonLabel || t('button-close')}
        </Button>
      </Spacer>
    </Container>
  )
}
