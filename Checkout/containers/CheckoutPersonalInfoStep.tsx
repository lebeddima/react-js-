import { Text } from '@/components/Text'
import styled from 'styled-components'
import { Button } from '@/components/buttons/Button'
import { Spacer } from '@/components/Spacer'
import { useAuth } from '@/hooks/use-auth'
import { useRedux } from '@/hooks/use-redux'
import { deviceCssQuery } from '@/styles/breakpoints'
import useTranslation from 'next-translate/useTranslation'
import { CheckoutStepsHeader } from '../components/CheckoutStepsHeader'
import { CheckoutSignUpForm } from './CheckoutSignUpForm'
import { setLoginModal } from '../store/checkout'
import { CheckoutLoginModal } from '../components/CheckoutLoginModal'
import { CheckoutPersonalInfoForm } from './CheckoutPersonalInfoForm'
import { TShoppingCartItem } from '../types'
import { getTotalCannabisWeight } from '../utlis/get-total-cannabis-weight'
import { MAX_CANNABIS_WEIGHT_LIMIT } from '../constants/cannabis-weight'

const Container = styled.div`
  padding: 32px 16px;

  @media screen and (${deviceCssQuery.sm}) {
    padding: 32px 40px;
  }
`

const FormContainer = styled.div`
  max-width: 385px;
`

const AlreadySignIn = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 32px;
`

type TProps = {
  productCart: TShoppingCartItem
}

export const CheckoutPersonalInfoStep: React.FC<TProps> = ({ productCart }) => {
  const { t } = useTranslation('checkout')
  const { dispatch } = useRedux()
  const { user } = useAuth()

  const totalCannabisWeight = getTotalCannabisWeight(productCart.products)

  const isMaxReached = totalCannabisWeight > MAX_CANNABIS_WEIGHT_LIMIT

  const openLoginModal = () => {
    dispatch(setLoginModal(true))
  }

  return (
    <>
      <CheckoutLoginModal />
      <Container>
        <Spacer xs={{ margin: '0 0 40px' }}>
          <CheckoutStepsHeader />
        </Spacer>
        <FormContainer>
          {user ? (
            <CheckoutPersonalInfoForm isButtonDisabled={isMaxReached} />
          ) : (
            <>
              <Text variant="b2" margin=" 0 0 16px">
                {t('personal-info.login-message')}
              </Text>
              <AlreadySignIn>
                <Text variant="b3">{t('personal-info.have-account')}</Text>
                <Button variant="tertiary-2" onClick={openLoginModal}>
                  {t('personal-info.log-in')}
                </Button>
              </AlreadySignIn>
              <CheckoutSignUpForm />
            </>
          )}
        </FormContainer>
      </Container>
    </>
  )
}
