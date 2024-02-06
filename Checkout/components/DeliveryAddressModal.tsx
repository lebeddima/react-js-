import * as yup from 'yup'
import { HeaderText } from '@/components/HeaderText'
import { CardWrapper } from '@/components/cards/CardWrapper'
import { ModalBase } from '@/components/modals/ModalBase'
import { useFormik } from 'formik'
import styled from 'styled-components'
import { validation } from '@/utils/validation'
import { FormikInput } from '@/inputs/formik-adapters/FormikInput'
import { useRedux } from '@/hooks/use-redux'
import { Button } from '@/components/buttons/Button'
import { Text } from '@/components/Text'
import useTranslation from 'next-translate/useTranslation'
import { TSaveDeliveryAddressReq } from '../api/rest/types'
import { saveDeliveryAddressAsync, setDeliveryAddressModal } from '../store/checkout'

const ModalHeader = styled.div`
  margin-bottom: 24px;
  text-align: center;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 16px;
`

export const DeliveryAddressModal: React.FC = () => {
  const { t } = useTranslation('checkout')
  const { dispatch } = useRedux()

  const handleClose = () => {
    dispatch(setDeliveryAddressModal(false))
  }

  const formik = useFormik<TSaveDeliveryAddressReq>({
    enableReinitialize: true,
    initialValues: {
      address: '',
      unit: '',
    },
    validationSchema: yup.object().shape({
      address: validation.required,
      unit: validation.required,
    }),
    onSubmit: (formData) => {
      dispatch(saveDeliveryAddressAsync({ formData, formik }))
    },
  })

  return (
    <ModalBase open maxWidth="488px" onClose={handleClose}>
      <CardWrapper xs={{ padding: '40px 24px' }} sm={{ padding: '40px 64px' }} border>
        <ModalHeader>
          <HeaderText
            mainText={t('delivery.modal-title')}
            secondText="."
            tag="h1"
            variant="h3"
          />
        </ModalHeader>
        <Form onSubmit={formik.handleSubmit}>
          <FormikInput
            required
            name="address"
            type="text"
            label={{ label: t('inputs:address') }}
            id="address_input"
            placeholder={t('inputs:placeholder.address')}
            formik={formik}
            size="l"
          />
          <FormikInput
            required
            name="unit"
            type="text"
            label={{ label: t('inputs:address-unit') }}
            id="unit_input"
            placeholder={t('inputs:placeholder.address')}
            formik={formik}
            size="l"
          />
          <Button
            size="l"
            type="submit"
            variant="primary"
            width="100%"
            loading={formik.isSubmitting}
          >
            {t('confirm')}
          </Button>
        </Form>
        <Text align="center" variant="d1" color="base700">
          {t('delivery.security-info')}
        </Text>
      </CardWrapper>
    </ModalBase>
  )
}
