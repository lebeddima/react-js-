import { useUnmount } from 'react-use'
import { useRedux } from '@/hooks/use-redux'
import useTranslation from 'next-translate/useTranslation'
import { ROUTES } from '@/constants/routes'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { FormSignIn } from './containers/FormSignIn'
import { reset, selectSignIn, setStep } from './store/sign-in'
import { Message } from './components/Message'
import { setFormSignUp, setStep as setStepSignUp } from './store/sign-up'

export const SignIn: React.FC = () => {
  const { t } = useTranslation('sign-in')
  const router = useRouter()
  const { dispatch, select } = useRedux()
  const { step, formSignIn } = select(selectSignIn)

  useUnmount(() => dispatch(reset()))

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [step])

  const handleIncomplete = () => {
    dispatch(setStepSignUp('email-code'))
    dispatch(setFormSignUp(formSignIn))
    router.push(ROUTES.SIGN_UP)
  }

  switch (step) {
    case null:
      return <FormSignIn />
    case 'incomplete-registration':
      return (
        <Message
          title={t('incomplete.title')}
          description={t('incomplete.description')}
          buttonLabel={t('incomplete.button')}
          onClickButton={handleIncomplete}
          onClose={() => dispatch(setStep(null))}
        />
      )
    default:
      return <></>
  }
}
