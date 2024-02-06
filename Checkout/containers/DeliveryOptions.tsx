import { useRedux } from '@/hooks/use-redux'
import { useEffect } from 'react'
import { Text } from '@/components/Text'
import styled from 'styled-components'
import { RadioButton } from '@/inputs/Radio/Radio'
import { Button } from '@/components/buttons/Button'
import { Spacer } from '@/components/Spacer'
import useTranslation from 'next-translate/useTranslation'
import { deviceCssQuery } from '@/styles/breakpoints'
import { selectCheckout, selectDelivery, setDeliveryNoteForm } from '../store/checkout'
import { DeliveryAddress } from './DeliveryAddress'
import { DeliveryNote } from '../components/DeliveryNote'

const OptionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
  margin-bottom: 18px;
  justify-content: space-between;
  padding-right: 25%;

  @media screen and (${deviceCssQuery.sm}) {
    justify-content: flex-start;
    gap: 32px;
  }
`

const FormContainer = styled.div`
  max-width: 385px;
`

export const DeliveryOptions: React.FC = () => {
  const { t } = useTranslation('checkout')
  const { select, dispatch } = useRedux()
  const { deliveries, selectedDelivery, deliveryNoteForm } = select(selectCheckout)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    const selected = deliveries.find((d) => d.id === value)
    if (selected) {
      dispatch(selectDelivery(selected))
    }
  }

  useEffect(() => {
    if (!deliveries.length) return
    if (selectedDelivery) return

    dispatch(selectDelivery(deliveries[0]))
  }, [deliveries.length])

  const openDeliveryNote = () => {
    dispatch(setDeliveryNoteForm(true))
  }

  return (
    <div>
      <Text variant="h4" margin="0 0 16px">
        {t('delivery.title-options')}
      </Text>
      <OptionsContainer>
        {deliveries.map(({ name, id }) => (
          <RadioButton
            key={id}
            checked={selectedDelivery?.id === id}
            onChange={handleChange}
            label={name}
            name="radio"
            value={id}
          />
        ))}
      </OptionsContainer>
      {selectedDelivery?.isAddrRequired ? (
        <Spacer xs={{ margin: '0 0 24px' }}>
          <DeliveryAddress />
        </Spacer>
      ) : null}
      <FormContainer>
        <Spacer xs={{ margin: '0 0 32px' }}>
          {deliveryNoteForm ? (
            <DeliveryNote />
          ) : (
            <Button variant="tertiary-2" onClick={openDeliveryNote}>
              {t('delivery.note-button')}
            </Button>
          )}
        </Spacer>
      </FormContainer>
    </div>
  )
}
