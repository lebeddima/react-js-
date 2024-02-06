import { Text } from '@/components/Text'
import { Button } from '@/components/buttons/Button'
import { useRedux } from '@/hooks/use-redux'
import styled from 'styled-components'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useRef } from 'react'
import { selectCheckout, setDeliveryAddressModal } from '../store/checkout'
import { DeliveryAddressModal } from '../components/DeliveryAddressModal'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
`

export const DeliveryAddress: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation('checkout')
  const { select, dispatch } = useRedux()

  const { deliveryAddress, deliveryAddressRequiredError, deliveryAddressModal } =
    select(selectCheckout)

  const showAddress = deliveryAddress?.address && deliveryAddress?.unit

  const handleOpen = () => {
    dispatch(setDeliveryAddressModal(true))
  }

  useEffect(() => {
    if (deliveryAddressRequiredError && containerRef.current) {
      containerRef.current.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [deliveryAddressRequiredError])

  return (
    <>
      {deliveryAddressModal && <DeliveryAddressModal />}
      <div>
        <Container ref={containerRef}>
          <Text variant="b2" color={deliveryAddressRequiredError ? 'error' : 'base900'}>
            {t('delivery.title-address')}
          </Text>
          <Button variant="tertiary-4" onClick={handleOpen}>
            {showAddress ? 'Change Address' : 'Add Address'}
          </Button>
        </Container>
        {deliveryAddressRequiredError && (
          <Text variant="d2" color="error">
            {t('delivery.address-required')}
          </Text>
        )}
        {showAddress && (
          <Text variant="b3">
            {deliveryAddress?.address} {deliveryAddress?.unit}
          </Text>
        )}
      </div>
    </>
  )
}
