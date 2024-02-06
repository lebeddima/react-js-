import { Text } from '@/components/Text'
import { Button } from '@/components/buttons/Button'
import { Tooltip } from '@/components/tooltips/Tooltip'
import { Password } from '@/components/tooltips/tooltip-menus/Password'
import { Referral } from '@/components/tooltips/tooltip-menus/Referral'
import { PHONE_MASK_CHAR, PHONE_PLACEHOLDER, PHONE_MASK } from '@/constants/phone-mask'
import { BIRTH_DATE_MASK, BIRTH_DATE_PLACEHOLDER } from '@/constants/birth-date-mask'
import { CheckBoxLink } from '@/features/auth/components/CheckBoxLink'
import { HelpIcon } from '@/icons/Help'
import { FormikCheckbox } from '@/inputs/formik-adapters/FormikCheckbox'
import { FormikInput } from '@/inputs/formik-adapters/FormikInput'
import { validation } from '@/utils/validation'
import { useFormik } from 'formik'
import Trans from 'next-translate/Trans'
import styled from 'styled-components'
import * as yup from 'yup'
import useTranslation from 'next-translate/useTranslation'
import { useRedux } from '@/hooks/use-redux'
import { apiAuth } from '@/features/auth/api/rest/auth'
import { handleActionErrors } from '@/utils/handle-action-errors'
import { useState } from 'react'
import { TCheckoutSignUpForm } from '../types'
import { CheckoutSignUpCode } from './CheckoutSignUpCode'
import { setPersonalInfo } from '../store/checkout'

export const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 16px;
  margin-bottom: 24px;
`

export const ReferralLabel = styled.div`
  display: flex;
  align-items: center;
`

export const HelpIconButton = styled.button`
  display: flex;
  align-items: center;
  margin-left: 4px;
`

export const CheckboxLabel = styled(Text)`
  &:hover {
    cursor: pointer;
  }
`

export const CheckoutSignUpForm: React.FC = () => {
  const { t } = useTranslation()
  const [confirmationHash, setConfirmationHash] = useState('')
  const { dispatch } = useRedux()

  const formik = useFormik<TCheckoutSignUpForm>({
    initialValues: {
      phone: '',
      password: '',
      repeatPassword: '',
      terms: false,
      firstName: '',
      lastName: '',
      birthDate: '',
      referralCode: '',
    },
    validationSchema: yup.object().shape({
      firstName: validation.required,
      lastName: validation.required,
      birthDate: validation.birthDate,
      phone: validation.required,
      password: validation.password,
      repeatPassword: validation.repeatPassword,
      terms: validation.singleCheckbox,
    }),
    onSubmit: async (formData) => {
      try {
        const { data } = await apiAuth.register({
          password: formData.password,
          phone: formData.phone,
          referralCode: formData.referralCode,
          terms: formData.terms,
          repeatPassword: formData.repeatPassword,
        })

        dispatch(
          setPersonalInfo({
            firstName: formData.firstName,
            lastName: formData.lastName,
            birthDate: formData.birthDate,
            phone: formData.phone,
          }),
        )

        setConfirmationHash(data.confirmationHash)
      } catch (e) {
        handleActionErrors({ e, dispatch, formik })
      } finally {
        formik.setSubmitting(false)
      }
    },
  })

  const handleClose = () => {
    setConfirmationHash('')
  }

  return (
    <>
      {confirmationHash && (
        <CheckoutSignUpCode confirmationHash={confirmationHash} onClose={handleClose} />
      )}
      <form onSubmit={formik.handleSubmit} autoComplete="off">
        <Inputs>
          <FormikInput
            required
            name="firstName"
            type="text"
            label={{ label: t('inputs:first-name') }}
            id="first_name_input"
            placeholder={t('inputs:placeholder.first-name')}
            formik={formik}
            size="l"
          />
          <FormikInput
            required
            name="lastName"
            type="text"
            label={{ label: t('inputs:last-name') }}
            placeholder={t('inputs:placeholder.last-name')}
            id="last_name_input"
            formik={formik}
            size="l"
          />
          <FormikInput
            name="phone"
            type="tel"
            label={{ label: t('inputs:phone') }}
            id="phone"
            formik={formik}
            mask={PHONE_MASK}
            maskChar={PHONE_MASK_CHAR}
            placeholder={PHONE_PLACEHOLDER}
            required
            size="l"
          />
          <FormikInput
            required
            name="birthDate"
            type="text"
            label={{ label: t('inputs:birth-date') }}
            id="birth_date_input"
            formik={formik}
            mask={BIRTH_DATE_MASK}
            placeholder={BIRTH_DATE_PLACEHOLDER}
          />
          <FormikInput
            name="password"
            type="password"
            label={{ label: t('inputs:password') }}
            placeholder={t('inputs:placeholder.password')}
            id="password"
            formik={formik}
            autoComplete="new-password"
            required
            tooltip={{
              renderMenu: () => <Password />,
            }}
          />
          <FormikInput
            required
            name="repeatPassword"
            type="password"
            autoComplete="new-password"
            label={{ label: t('inputs:repeat-password') }}
            placeholder={t('inputs:placeholder.repeat-password')}
            id="repeat-password"
            formik={formik}
          />
          <FormikInput
            name="referralCode"
            label={{
              label: (
                <ReferralLabel>
                  {t('referral:information-label')}
                  <Tooltip
                    position="top center"
                    on="hover"
                    trigger={
                      <HelpIconButton type="button">
                        <HelpIcon />
                      </HelpIconButton>
                    }
                    renderMenu={() => <Referral />}
                    maxWidth="200px"
                  />
                </ReferralLabel>
              ),
            }}
            placeholder={t('referral:code-placeholder')}
            id="referralCode"
            formik={formik}
          />
          <FormikCheckbox
            name="terms"
            label={
              <Trans
                i18nKey="sign-up:terms"
                components={{
                  component: <CheckboxLabel tag="span" variant="l1" />,
                  terms: <CheckBoxLink externalLink href="/terms" />,
                  policy: <CheckBoxLink externalLink href="/policy" />,
                  star: <Text tag="span" variant="l1" color="primary700" />,
                }}
              />
            }
            formik={formik}
          />
        </Inputs>
        <Button
          type="submit"
          size="l"
          width="100%"
          variant="primary"
          loading={formik.isSubmitting}
          disabled={!formik.isValid || !formik.dirty}
        >
          {t('checkout:confirm')}
        </Button>
      </form>
    </>
  )
}
