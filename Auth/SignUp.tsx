import { useUnmount } from 'react-use'
import { useRedux } from '@/hooks/use-redux'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { ROUTES } from '@/constants/routes'
import Trans from 'next-translate/Trans'
import { Text } from '@/components/Text'
import { useEffect } from 'react'
import { FormSignUp } from './containers/FormSignUp'
import { reset, selectSignUp, setStep } from './store/sign-up'
import { Message } from './components/Message'
import { FormSignUpCode } from './containers/FormSignUpCode'
import { SEND_EMAIL_CODE_TIMEOUT } from './constants'

export const SignUp: React.FC = () => {
  const { t } = useTranslation('sign-up')
  const router = useRouter()
  const { select, dispatch } = useRedux()
  const { step, formSignUp } = select(selectSignUp)

  useUnmount(() => dispatch(reset()))

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [step])

  const handleCloseEmailErr = () => dispatch(setStep(null))

  switch (step) {
    case null:
      return <FormSignUp />
    case 'email-code':
      return <FormSignUpCode />
    case 'email-code-error':
      return (
        <Message
          status="error"
          title="Error"
          buttonLabel={t('get-email-code.button-try-again')}
          onClickButton={handleCloseEmailErr}
          description={
            <Trans
              i18nKey="sign-up:get-email-code.error-message"
              components={{ email: <Text variant="b7" /> }}
              values={{
                email: formSignUp.email,
                seconds: SEND_EMAIL_CODE_TIMEOUT / 1000,
              }}
            />
          }
        />
      )
    case 'success':
      return (
        <Message
          status="success"
          description={t('success.description')}
          buttonLabel={t('success.button')}
          onClickButton={() => router.push(ROUTES.SIGN_IN)}
          onClose={() => dispatch(reset())}
        />
      )
    default:
      return <></>
  }
}
