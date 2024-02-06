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
import { selectSignIn, signInAsync } from '../../store/sign-in'
import * as S from './styled'
import { Link } from '../../components/Link'
import { ComposeLink } from '../../components/ComposeLink'

export const FormSignIn: FC = () => {
  const { t } = useTranslation('sign-in')
  const { dispatch, select } = useRedux()
  const { formSignIn } = select(selectSignIn)

  const formik = useFormik({
    initialValues: {
      email: formSignIn.email || '',
      password: '',
    },
    validationSchema: yup.object().shape({
      email: validation.required,
      password: validation.password,
    }),
    onSubmit: (formData) => {
      dispatch(signInAsync({ formData, formik }))
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

      <Spacer xs={{ margin: '32px 0 0 0' }}>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <S.Inputs>
            <FormikInput
              name="email"
              label={{ label: t('inputs:email') }}
              placeholder={t('inputs:placeholder.email')}
              id="lastName"
              formik={formik}
            />
            <FormikInput
              name="password"
              type="password"
              label={{ label: t('inputs:password') }}
              placeholder={t('inputs:placeholder.password')}
              id="password"
              formik={formik}
            />
          </S.Inputs>

          <Spacer
            xs={{ margin: '16px 0 0 0' }}
            sm={{ margin: '8px 0 0 0' }}
            textAlign="right"
          >
            <Link href={ROUTES.FORGOT_PASSWORD}>{t('password:forgot-password')}</Link>
          </Spacer>

          <S.Button xs={{ margin: '32px 0 0' }}>
            <Button
              variant="primary"
              size="l"
              type="submit"
              isLoading={formik.isSubmitting}
              width="100%"
            >
              {t('button-login')}
            </Button>
          </S.Button>
        </form>
      </Spacer>

      <Spacer xs={{ margin: '24px 0 0' }}>
        <ComposeLink
          href={ROUTES.SIGN_UP}
          i18nKey="sign-in:description-register-link"
          textComponent={<Text tag="span" variant="b3" />}
        />
      </Spacer>
    </CardWrapper>
  )
}
