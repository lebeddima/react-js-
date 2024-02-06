import { Button } from '@/components/buttons/Button'
import { useFormik } from 'formik'
import { ROUTES } from '@/constants/routes'
import { useRedux } from '@/hooks/use-redux'
import * as yup from 'yup'
import { validation } from '@/utils/validation'
import useTranslation from 'next-translate/useTranslation'
import { FC } from 'react'
import { Text } from '@/components/Text'
import { FormikInput } from '@/inputs/formik-adapters/FormikInput'
import { FormikCheckbox } from '@/inputs/formik-adapters/FormikCheckbox'
import { CardWrapper } from '@/components/cards/CardWrapper'
import { Spacer } from '@/components/Spacer'
import { HeaderText } from '@/components/HeaderText'
import { ExternalLink } from '@/components/links/ExternalLink'
import { register, selectSignUp } from '../../store/sign-up'
import * as S from './FormSignUp.styled'
import { ComposeLink } from '../../components/ComposeLink'

export const FormSignUp: FC = () => {
  const { t } = useTranslation('sign-up')
  const { dispatch, select } = useRedux()
  const { formSignUp } = select(selectSignUp)

  const formik = useFormik({
    initialValues: {
      firstName: formSignUp.firstName || '',
      lastName: formSignUp.lastName || '',
      email: formSignUp.email || '',
      password: formSignUp.password || '',
      terms: formSignUp.terms || false,
    },
    validationSchema: yup.object().shape({
      firstName: validation.required,
      lastName: validation.required,
      email: validation.required,
      password: validation.password,
      terms: validation.singleCheckbox,
    }),
    onSubmit: (formData) => {
      dispatch(register({ formData, formik }))
    },
  })

  return (
    <CardWrapper xs={{ padding: '32px 16px' }} sm={{ padding: '40px 40px' }}>
      <HeaderText
        mainText={t('title')}
        tag="h1"
        variants={{ xs: 'h3', sm: 'h2' }}
        textAlign="left"
      />

      <Spacer xs={{ margin: '32px 0 0 0' }} sm={{ margin: '48px 0 0 0' }}>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <S.Inputs>
            <S.InputCont>
              <FormikInput
                name="firstName"
                label={{ label: t('inputs:first-name') }}
                id="firstName"
                formik={formik}
                placeholder={t('inputs:placeholder.type-here')}
              />

              <FormikInput
                name="lastName"
                label={{ label: t('inputs:last-name') }}
                placeholder={t('inputs:placeholder.type-here')}
                id="lastName"
                formik={formik}
              />
            </S.InputCont>

            <S.InputCont>
              <FormikInput
                name="email"
                label={{ label: t('inputs:email') }}
                placeholder={t('inputs:placeholder.email')}
                id="email"
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
            </S.InputCont>

            <FormikCheckbox
              name="terms"
              label={
                <ComposeLink
                  i18nKey="sign-up:terms"
                  link={<ExternalLink href={ROUTES.PRIVACY_POLICY} />}
                  textComponent={<S.CheckboxLabel tag="span" variant="b3" />}
                />
              }
              formik={formik}
            />
          </S.Inputs>

          <Spacer xs={{ margin: '32px 0 0' }} sm={{ margin: '40px 0 0 0' }}>
            <Button
              variant="primary"
              type="submit"
              size="l"
              isLoading={formik.isSubmitting}
              width="100%"
            >
              {t('common:submit')}
            </Button>
          </Spacer>
        </form>
      </Spacer>

      <Spacer xs={{ margin: '16px 0 0' }} textAlign="center">
        <ComposeLink
          i18nKey="sign-up:description-login-link"
          href={ROUTES.SIGN_IN}
          textComponent={<Text tag="span" variant="b3" />}
        />
      </Spacer>
    </CardWrapper>
  )
}
