import { useRedux } from '@/hooks/use-redux'
import useTranslation from 'next-translate/useTranslation'
import { TextArea } from '@/inputs/TextArea'
import { selectCheckout, setDeliveryNote } from '../store/checkout'

export const DeliveryNote: React.FC = () => {
  const { select, dispatch } = useRedux()
  const { t } = useTranslation('checkout')

  const { deliveryNote } = select(selectCheckout)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value as string
    dispatch(setDeliveryNote(value))
  }

  return (
    <TextArea
      name="delivery-note"
      placeholder={t('delivery.note-placeholder')}
      value={deliveryNote}
      onChange={handleChange}
      rows={4}
    />
  )
}
