import { HeaderText } from '@/components/HeaderText'
import { SendCode } from '@/components/SendCode'
import { Spacer } from '@/components/Spacer'
import { Text } from '@/components/Text'
import { Button } from '@/components/buttons/Button'
import { CardWrapper } from '@/components/cards/CardWrapper'
import { ModalBase } from '@/components/modals/ModalBase'
import { ERROR_STATUS } from '@/constants/error-status'
import { apiOtpRegister } from '@/features/auth/api/rest/otp-register'
import useTranslation from 'next-translate/useTranslation'
import { TOtpRegisterReq, TOtpRegisterResendReq } from '@/features/auth/api/rest/types'
import { SEND_EMAIL_CODE_TIMEOUT } from '@/features/auth/constants'
import { useRedux } from '@/hooks/use-redux'
import { handleActionErrors } from '@/utils/handle-action-errors'
import { useState } from 'react'
import styled from 'styled-components'
import { setLoginModal } from '../store/checkout'

const ModalHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
`

type TProps = {
  confirmationHash: string
  onClose: () => void
}

type CodeError = {
  code?: string
  again?: string
}

export const CheckoutSignUpCode: React.FC<TProps> = ({ confirmationHash, onClose }) => {
  const { t } = useTranslation()
  const [step, setStep] = useState<'code' | 'success'>('code')
  const { dispatch } = useRedux()
  const [loading, setLoading] = useState<'code' | 'resend' | null>(null)
  const [error, setError] = useState<CodeError>({ code: '', again: '' })

  const handleClose = () => {
    onClose()
  }

  const handleClearError = (error: CodeError) => {
    setError(error)
  }

  const handleSubmit = async (code: string) => {
    try {
      setLoading('code')
      const hash = confirmationHash
      await apiOtpRegister.verify({ code, hash })
      setStep('success')
    } catch (e) {
      handleActionErrors<Partial<TOtpRegisterReq>>({
        e,
        dispatch,
        additionalConditions: (status, data) => {
          if (status === ERROR_STATUS.MESSAGE && data.errors?.code) {
            setError({ code: data.errors.code })
            return true
          }
        },
      })
    } finally {
      setLoading(null)
    }
  }

  const handleResend = async () => {
    try {
      setLoading('resend')
      const hash = confirmationHash
      await apiOtpRegister.resend({ hash })
    } catch (e) {
      handleActionErrors<Partial<TOtpRegisterResendReq>>({
        e,
        dispatch,
        additionalConditions: (status, data) => {
          if (status === ERROR_STATUS.MESSAGE && data.errors?.hash) {
            setError({ again: data.errors.hash })
            return true
          }
        },
      })
    } finally {
      setLoading(null)
    }
  }

  const handleLoginClick = () => {
    handleClose()
    dispatch(setLoginModal(true))
  }

  if (step === 'success') {
    return (
      <ModalBase open maxWidth="488px" onClose={handleClose}>
        <CardWrapper xs={{ padding: '40px 24px' }} sm={{ padding: '40px 64px' }} border>
          <ModalHeader>
            <HeaderText
              mainText="Congratulations"
              secondText="!"
              tag="h1"
              variant="h3"
              margin="0 0 8px"
            />
            <Text variant="b1" color="base700" margin="0 0 24px">
              {t('sign-up:success-desc')}
            </Text>
          </ModalHeader>
          <Button width="100%" size="l" variant="primary" onClick={handleLoginClick}>
            {t('sign-in:log-in')}
          </Button>
        </CardWrapper>
      </ModalBase>
    )
  }

  return (
    <ModalBase open maxWidth="513px" onClose={handleClose}>
      <CardWrapper xs={{ padding: '40px 24px' }} sm={{ padding: '40px 64px' }} border>
        <ModalHeader>
          <HeaderText
            mainText="Create your account"
            secondText="."
            tag="h1"
            variant="h3"
          />
          <Text variant="b5" color="base700" margin="24px 0 16px">
            {t('sign-up:code.sms-description')}
          </Text>
        </ModalHeader>
        <SendCode
          clearError={handleClearError}
          onClickAgain={handleResend}
          onSubmit={handleSubmit}
          error={error}
          sendAgainTimeout={SEND_EMAIL_CODE_TIMEOUT}
          loading={loading}
        />
        <Spacer xs={{ margin: '24px 0 0' }} textAlign="center">
          <Button variant="tertiary-2" onClick={handleClose}>
            {t('sign-up:code.button-to-first-step')}
          </Button>
        </Spacer>
      </CardWrapper>
    </ModalBase>
  )
}
