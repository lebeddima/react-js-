import * as yup from 'yup'
import { HeaderText } from '@/components/HeaderText'
import { Button } from '@/components/buttons/Button'
import { CardWrapper } from '@/components/cards/CardWrapper'
import { ModalBase } from '@/components/modals/ModalBase'
import { useRedux } from '@/hooks/use-redux'
import styled from 'styled-components'
import { Spacer } from '@/components/Spacer'
import { useFormik } from 'formik'
import { validation } from '@/utils/validation'
import useTranslation from 'next-translate/useTranslation'
import { FormikInput } from '@/inputs/formik-adapters/FormikInput'
import {
  getPromocodeAsync,
  selectOrderSummary,
  setPromocodeModal,
} from '../store/order-summary'

const ModalHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
`

const Form = styled.form``

export const PromocodeModal: React.FC = () => {
  const { t } = useTranslation('checkout')
  const { select, dispatch } = useRedux()

  const { promocodeModal } = select(selectOrderSummary)

  const formik = useFormik({
    initialValues: {
      code: '',
    },
    validationSchema: yup.object().shape({
      code: validation.required,
    }),
    onSubmit: (formData) => {
      dispatch(getPromocodeAsync({ formData, formik }))
    },
  })

  const handleClose = () => {
    formik.resetForm()
    dispatch(setPromocodeModal(false))
  }

  if (!promocodeModal) return null

  return (
    <ModalBase open maxWidth="488px" onClose={handleClose}>
      <CardWrapper xs={{ padding: '40px 24px' }} sm={{ padding: '40px 64px' }} border>
        <ModalHeader>
          <HeaderText
            mainText={t('order-summary.promocode-title')}
            secondText="."
            tag="h1"
            variant="h3"
          />
        </ModalHeader>
        <Form onSubmit={formik.handleSubmit}>
          <Spacer xs={{ margin: '0 0 24px' }}>
            <FormikInput
              name="code"
              type="text"
              placeholder={t('order-summary.promocode-placeholder')}
              id="promocode"
              formik={formik}
              size="l"
            />
          </Spacer>
          <Button
            loading={formik.isSubmitting}
            type="submit"
            variant="primary"
            size="l"
            width="100%"
          >
            {t('confirm')}
          </Button>
        </Form>
      </CardWrapper>
    </ModalBase>
  )
}
