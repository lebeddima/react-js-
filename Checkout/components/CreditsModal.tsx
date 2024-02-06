import { HeaderText } from '@/components/HeaderText'
import { Text } from '@/components/Text'
import { Button } from '@/components/buttons/Button'
import { CardWrapper } from '@/components/cards/CardWrapper'
import { ModalBase } from '@/components/modals/ModalBase'
import { useAuth } from '@/hooks/use-auth'
import { useRedux } from '@/hooks/use-redux'
import { useState } from 'react'
import { NumberInput } from '@/inputs/NumberInput/NumberInput'
import useTranslation from 'next-translate/useTranslation'
import styled from 'styled-components'
import { selectOrderSummary, setCredits, setCreditsModal } from '../store/order-summary'

const ModalHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
`

const Form = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

export const CreditsModal: React.FC = () => {
  const { t } = useTranslation('checkout')
  const { select, dispatch } = useRedux()
  const { user } = useAuth()
  const [value, setValue] = useState(user && user.credits > 0 ? 1 : 0)

  const { creditsModal } = select(selectOrderSummary)

  const handleClose = () => {
    dispatch(setCreditsModal(false))
  }

  const handleChange = (value: number) => {
    setValue(value)
  }

  const handleSubmit = () => {
    dispatch(setCredits(value))
    handleClose()
  }

  if (!creditsModal) return null

  return (
    <ModalBase open maxWidth="488px" onClose={handleClose}>
      <CardWrapper xs={{ padding: '40px 24px' }} sm={{ padding: '40px 64px' }} border>
        <ModalHeader>
          <HeaderText
            mainText={t('order-summary.credits-title')}
            secondText="."
            tag="h1"
            variant="h3"
          />
          <Text variant="b5" color="base700" margin="24px 0 16px">
            {t('order-summary.credits-subtitle')}
          </Text>
        </ModalHeader>
        <Form>
          <div>
            <Text variant="b5">{t('order-summary.you-have')}</Text>
            <Text variant="h4" color="primary700">
              {user?.credits} {t('order-summary.credits')}
            </Text>
          </div>
          <NumberInput
            onChange={handleChange}
            disabled={!user?.credits}
            size="m"
            min={0}
            value={value}
            max={user?.credits}
          />
        </Form>
        <Button variant="primary" size="l" width="100%" onClick={handleSubmit}>
          {t('confirm')}
        </Button>
      </CardWrapper>
    </ModalBase>
  )
}
