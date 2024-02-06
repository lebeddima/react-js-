import { useRedux } from '@/hooks/use-redux'
import useTranslation from 'next-translate/useTranslation'
import { FC, useEffect } from 'react'
import { Text } from '@/components/Text'
import { Spacer } from '@/components/Spacer'
import { SendCode } from '@/components/SendCode'
import { CardWrapper } from '@/components/cards/CardWrapper'
import { SEND_EMAIL_CODE_TIMEOUT } from '@/features/auth/constants'
import {
  TInit,
  selectForgot,
  setErrorCode,
  setStep,
  getCode,
  getCodeAgain,
  sendCode,
} from '@/features/auth/store/forgot-pass'
import { ButtonBack } from '@/components/buttons/ButtonBack'
import { HeaderText } from '@/components/HeaderText'
import { Loader } from '@/components/loaders/Loader'

export const FormForgotCode: FC = () => {
  const { t } = useTranslation('forgot-pass')
  const { select, dispatch } = useRedux()
  const { code, form } = select(selectForgot)
  const { fetching, error, init } = code

  useEffect(() => {
    dispatch(getCode())
  }, [])

  const handleClearError = (error: TInit['code']['error']) => {
    dispatch(setErrorCode(error))
  }

  const handleResend = () => {
    dispatch(getCodeAgain(t))
  }

  const onSubmit = (code: string) => {
    if (error.code) return
    dispatch(sendCode(code, t))
  }

  const handleClickBack = () => {
    dispatch(setStep(null))
  }

  if (!init) {
    return <Loader />
  }

  return (
    <>
      <Spacer xs={{ margin: '0 auto' }}>
        <CardWrapper
          xs={{ padding: '24px 16px' }}
          sm={{ padding: '40px 40px' }}
          maxWidth="533px"
        >
          <ButtonBack onClick={handleClickBack} />

          <Spacer xs={{ padding: '32px 0 0' }} sm={{ padding: '16px 0 0' }}>
            <HeaderText
              mainText={t('code.title-confirm')}
              tag="h1"
              variants={{ xs: 'h3', sm: 'h2' }}
              textAlign="left"
            />
          </Spacer>

          <Spacer xs={{ margin: '32px 0 0' }} sm={{ margin: '64px 0 0' }}>
            <SendCode
              clearError={handleClearError}
              onClickAgain={handleResend}
              onSubmit={onSubmit}
              error={error}
              sendAgainTimeout={SEND_EMAIL_CODE_TIMEOUT}
              isLoading={fetching}
              submitTitle={t('code.button-submit')}
              description={
                <>
                  <Text variant="b3">{t('code.description-confirm')}</Text>
                  <Text tag="div" variant="b7">
                    {form.email}
                  </Text>
                </>
              }
            />
          </Spacer>
        </CardWrapper>
      </Spacer>
    </>
  )
}
