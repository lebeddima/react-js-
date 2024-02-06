import useTranslation from 'next-translate/useTranslation'
import { ModalMessage } from '@/components/modals/ModalMessage'
import { useSuccess } from '@/features/trade/hooks/create-order/use-success'

export const Success: React.FC = () => {
  const { t } = useTranslation('trade')
  const { success, setSuccess } = useSuccess()

  const onCloseSuccess = () => {
    setSuccess(false)
  }

  if (!success) return null

  return (
    <ModalMessage
      id="create-order-success"
      onClose={onCloseSuccess}
      title={t('create-order.success-modal.title')}
      status="success"
      description={t('create-order.success-modal.description')}
      onClickButton={onCloseSuccess}
    />
  )
}
