import { validation } from '@/utils/validation'
import * as yup from 'yup'
import { useFormik } from 'formik'
import useTranslation from 'next-translate/useTranslation'
import { BIRTH_DATE_MASK, BIRTH_DATE_PLACEHOLDER } from '@/constants/birth-date-mask'
import { FormikInput } from '@/inputs/formik-adapters/FormikInput'
import styled from 'styled-components'
import { useRedux } from '@/hooks/use-redux'
import { PHONE_MASK, PHONE_MASK_CHAR, PHONE_PLACEHOLDER } from '@/constants/phone-mask'
import { Button } from '@/components/buttons/Button'
import { useAuth } from '@/hooks/use-auth'
import { savePersonalInfoAsync, selectCheckout } from '../store/checkout'
import { TValidatePersonalInfoReq } from '../api/rest/types'

export const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  gap: 16px;
  margin-bottom: 24px;
`

type TProps = {
  isButtonDisabled: boolean
}

export const CheckoutPersonalInfoForm: React.FC<TProps> = ({ isButtonDisabled }) => {
  const { t } = useTranslation('checkout')
  const { select, dispatch } = useRedux()
  const { user } = useAuth()
  const { personalInfo } = select(selectCheckout)

  const formik = useFormik<TValidatePersonalInfoReq>({
    enableReinitialize: true,
    initialValues: {
      phone: personalInfo?.phone || user?.phone || '',
      firstName: personalInfo?.firstName || user?.firstName || '',
      lastName: personalInfo?.lastName || user?.lastName || '',
      birthDate: personalInfo?.birthDate || user?.birthDate || '',
    },
    validationSchema: yup.object().shape({
      firstName: validation.required,
      lastName: validation.required,
      birthDate: validation.birthDate,
      phone: validation.required,
    }),
    onSubmit: (formData, formikHelpers) => {
      dispatch(savePersonalInfoAsync({ formData, formik: formikHelpers }))
    },
  })

  return (
    <form onSubmit={formik.handleSubmit} autoComplete="off">
      <Inputs>
        <FormikInput
          required
          name="firstName"
          type="text"
          label={{ label: 'First Name' }}
          id="first_name_input"
          placeholder="Enter your name"
          formik={formik}
          size="l"
        />
        <FormikInput
          required
          name="lastName"
          type="text"
          label={{ label: 'Last Name' }}
          placeholder="Enter your last name"
          id="last_name_input"
          formik={formik}
          size="l"
        />
        <FormikInput
          name="phone"
          type="tel"
          label={{ label: 'Phone Number' }}
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
          label={{ label: 'Date of Birth' }}
          id="birth_date_input"
          formik={formik}
          mask={BIRTH_DATE_MASK}
          placeholder={BIRTH_DATE_PLACEHOLDER}
        />
      </Inputs>
      <Button
        loading={formik.isSubmitting}
        disabled={isButtonDisabled}
        size="l"
        width="100%"
        type="submit"
        variant="primary"
      >
        {t('confirm')}
      </Button>
    </form>
  )
}
