import { Button } from '@/components/buttons/Button'
import { useFormik } from 'formik'
import { useRedux } from '@/hooks/use-redux'
import * as yup from 'yup'
import { validation } from '@/utils/validation'
import useTranslation from 'next-translate/useTranslation'
import { FC } from 'react'
import { FormikInput } from '@/inputs/formik-adapters/FormikInput'
import { Spacer } from '@/components/Spacer'
import { ROUTES } from '@/constants/routes'
import { HeaderText } from '@/components/HeaderText'
import { CardWrapper } from '@/components/cards/CardWrapper'
import { Text } from '@/components/Text'
import { ComposeLink } from '../../components/ComposeLink'
import { selectForgot, validateEmai } from '../../store/forgot-pass'

export const FormForgotEmail: FC = () => {
  const { t } = useTranslation('forgot-pass')
  const { dispatch, select } = useRedux()
  const { form } = select(selectForgot)

  const formik = useFormik({
    initialValues: {
      email: form.email || '',
    },
    validationSchema: yup.object().shape({
      email: validation.required,
    }),
    onSubmit: (formData) => {
      dispatch(validateEmai({ formData, formik }))
    },
  })

  return (
    <CardWrapper xs={{ padding: '24px 16px' }} sm={{ padding: '40px 40px' }}>
      <HeaderText
        mainText={t('title')}
        tag="h1"
        variants={{ xs: 'h3', sm: 'h2' }}
        textAlign="left"
      />

      <Spacer xs={{ margin: '32px 0 0 0' }} sm={{ margin: '40px 0 0 0' }}>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <FormikInput
            name="email"
            label={{ label: t('inputs:email') }}
            placeholder={t('inputs:placeholder.email')}
            id="email"
            formik={formik}
          />

          <Spacer xs={{ margin: '40px 0 0' }}>
            <Button
              variant="primary"
              size="l"
              type="submit"
              isLoading={formik.isSubmitting}
              width="100%"
            >
              {t('button-send-email')}
            </Button>
          </Spacer>
        </form>
      </Spacer>

      <Spacer xs={{ margin: '24px 0 0' }}>
        <ComposeLink
          href={ROUTES.SIGN_IN}
          i18nKey="forgot-pass:description-login-link"
          textComponent={<Text tag="span" variant="b3" />}
        />
      </Spacer>
    </CardWrapper>
  )
}
