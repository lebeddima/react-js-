import { Button } from '@/components/buttons/Button'
import { useFormik } from 'formik'
import { useRedux } from '@/hooks/use-redux'
import * as yup from 'yup'
import { validation } from '@/utils/validation'
import useTranslation from 'next-translate/useTranslation'
import { FC } from 'react'
import { FormikInput } from '@/inputs/formik-adapters/FormikInput'
import { Spacer } from '@/components/Spacer'
import { HeaderText } from '@/components/HeaderText'
import { CardWrapper } from '@/components/cards/CardWrapper'
import { ButtonBack } from '@/components/buttons/ButtonBack'
import * as S from './styled'
import { setStep, sendPass } from '../../store/forgot-pass'

export const FormForgotPass: FC = () => {
  const { t } = useTranslation('forgot-pass')
  const { dispatch } = useRedux()

  const formik = useFormik({
    initialValues: {
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: yup.object().shape({
      password: validation.required,
      passwordConfirmation: validation.repeatPassword,
    }),
    onSubmit: (formData) => {
      dispatch(sendPass({ formData, formik }))
    },
  })

  const handleClickBack = () => {
    dispatch(setStep(null))
  }

  return (
    <CardWrapper xs={{ padding: '24px 16px' }} sm={{ padding: '40px 40px' }}>
      <ButtonBack title={t('pass.button-back')} onClick={handleClickBack} />

      <Spacer xs={{ margin: '16px 0 0 0' }}>
        <HeaderText
          mainText={t('pass.title')}
          tag="h1"
          variants={{ xs: 'h3', sm: 'h2' }}
          textAlign="left"
        />
      </Spacer>

      <Spacer xs={{ margin: '32px 0 0 0' }} sm={{ margin: '40px 0 0 0' }}>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <S.Inputs>
            <FormikInput
              name="password"
              type="password"
              label={{ label: t('inputs:password') }}
              placeholder={t('inputs:placeholder.password')}
              id="password"
              formik={formik}
            />
            <FormikInput
              name="passwordConfirmation"
              type="password"
              label={{ label: t('inputs:repeat-password') }}
              placeholder={t('inputs:placeholder.repeat-password')}
              id="passwordConfirmation"
              formik={formik}
            />
          </S.Inputs>

          <Spacer xs={{ margin: '40px 0 0' }}>
            <Button
              variant="primary"
              size="l"
              type="submit"
              isLoading={formik.isSubmitting}
              width="100%"
            >
              {t('pass.button-submit')}
            </Button>
          </Spacer>
        </form>
      </Spacer>
    </CardWrapper>
  )
}
