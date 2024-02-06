import { useUnmount } from 'react-use'
import { useRedux } from '@/hooks/use-redux'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { ROUTES } from '@/constants/routes'
import Trans from 'next-translate/Trans'
import { Text } from '@/components/Text'
import { useEffect } from 'react'
import { Message } from './components/Message'
import { SEND_EMAIL_CODE_TIMEOUT } from './constants'
import { FormForgotEmail } from './containers/FormForgotEmail'
import { FormForgotCode } from './containers/FormForgotCode'
import { reset, selectForgot, setStep } from './store/forgot-pass'
import { FormForgotPass } from './containers/FormForgotPass'

export const ForgotPass: React.FC = () => {
  const { t } = useTranslation('forgot-pass')
  const router = useRouter()
  const { select, dispatch } = useRedux()
  const { step, form } = select(selectForgot)

  useUnmount(() => dispatch(reset()))

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [step])

  const handleCloseEmailErr = () => dispatch(setStep(null))

  switch (step) {
    case null:
      return <FormForgotEmail />
    case 'email-code':
      return <FormForgotCode />
    case 'email-code-error':
      return (
        <Message
          status="error"
          title="Error"
          buttonLabel={t('get-email-code.button-try-again')}
          onClickButton={handleCloseEmailErr}
          description={
            <Trans
              i18nKey="forgot-pass:get-email-code.error-message"
              components={{ email: <Text variant="b7" /> }}
              values={{
                email: form.email,
                seconds: SEND_EMAIL_CODE_TIMEOUT / 1000,
              }}
            />
          }
        />
      )
    case 'password':
      return <FormForgotPass />
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
