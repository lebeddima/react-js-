import { HeaderText } from '@/components/HeaderText'
import { CardWrapper } from '@/components/cards/CardWrapper'
import { ModalBase } from '@/components/modals/ModalBase'
import { FormSignIn } from '@/features/auth/containers/FormSignIn'
import { useRedux } from '@/hooks/use-redux'
import useTranslation from 'next-translate/useTranslation'
import styled from 'styled-components'
import { useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { selectCheckout, setLoginModal } from '../store/checkout'

const ModalHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
`

export const CheckoutLoginModal: React.FC = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const { select, dispatch } = useRedux()
  const { loginModal } = select(selectCheckout)

  const handleClose = () => {
    dispatch(setLoginModal(false))
  }

  useEffect(() => {
    if (user) {
      handleClose()
    }
  }, [user])

  if (!loginModal) {
    return null
  }

  return (
    <ModalBase open maxWidth="513px" onClose={handleClose}>
      <CardWrapper xs={{ padding: '40px 24px' }} sm={{ padding: '40px 64px' }} border>
        <ModalHeader>
          <HeaderText
            mainText={t('sign-in:title')}
            secondText="."
            tag="h1"
            variant="h3"
            margin="0 0 8px"
          />
        </ModalHeader>
        <FormSignIn />
      </CardWrapper>
    </ModalBase>
  )
}
