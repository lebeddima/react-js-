import { Button } from '@/components/buttons/Button'
import {
  CardNumberElement,
  CVVElement,
  useComposableContainer,
  ComposableContainer,
  useMakeSkyflowStyles,
  CardHolderNameElement,
  ExpirationMonthElement,
  ExpirationYearElement,
} from 'skyflow-react-js'
import styled, { useTheme } from 'styled-components'
import { useState } from 'react'
import { handleActionErrors } from '@/utils/handle-action-errors'
import useTranslation from 'next-translate/useTranslation'
import { useRedux } from '@/hooks/use-redux'
import { toast } from 'react-toastify'
import { Text } from '@/components/Text'
import { TGetSkyFlowRecordsRes } from '../types'
import {
  saveCardAsync,
  selectCheckout,
  setDeliveryAddressRequiredError,
  setSavingCard,
} from '../store/checkout'

const Container = styled.div<{ isDesktop: boolean }>`
  height: ${({ isDesktop }) => (isDesktop ? '400px' : '600px')};
  max-width: 385px;
  display: flex;
  flex-direction: column;

  > div {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
`

type TSkyFlowElementType =
  | 'CARD_NUMBER'
  | 'CVV'
  | 'EXPIRATION_MONTH'
  | 'EXPIRATION_YEAR'
  | 'CARDHOLDER_NAME'

type SkyFlowChangeEvent = {
  elementType: TSkyFlowElementType
  isEmpty: boolean
  isFocused: boolean
  isValid: boolean
  value: string
}

const SKY_FLOW_TABLE = 'payment_cards'

type Props = {
  isDesktop: boolean
}

const DESKTOP_CONTAINER_LAYOUT = [1, 2, 2]

const MOBILE_CONTAINER_LAYOUT = [1, 1, 1, 1, 1]

export const NewCreditCardForm: React.FC<Props> = ({ isDesktop }) => {
  const { t } = useTranslation('checkout')
  const { select, dispatch } = useRedux()
  const theme = useTheme()
  const [isCvvValid, setCvvValid] = useState(false)
  const [isCardNumberValid, setCardNumberValid] = useState(false)
  const [isExpirationMonthValid, setExpirationMonthValid] = useState(false)
  const [isExpirationYearValid, setExpirationYearValid] = useState(false)
  const [isCardHolderNameValid, setCardHolderNameValid] = useState(false)

  const { savingCard, selectedDelivery, deliveryAddress } = select(selectCheckout)

  const useStyles = useMakeSkyflowStyles({
    inputStyles: {
      base: {
        fontFamily: 'Inter, sans-serif',
        margin: 0,
        textIndent: '0px',
        border: `2px solid ${theme.palette.base300}`,
        borderRadius: '32px',
        color: theme.palette.base900,
        padding: '15px 24px',
        fontSize: '16px',
        lineHeight: '26px',
        transition: 'border-color 0.2s ease-in-out',
      },
      focus: { border: `2px solid ${theme.palette.primary700}` },
      invalid: { color: theme.palette.error },
    },
    labelStyles: {
      base: {
        fontSize: '16px',
        fontWeight: '400',
        lineHeight: '26px',
        color: theme.palette.base900,
        marginBottom: '4px',
        display: 'inline-block',
        fontFamily: 'sans-serif',
      },
    },
    errorTextStyles: {
      base: {
        background: 'red',
        color: theme.palette.error,
        padding: '0px',
        fontFamily: 'sans-serif',
      },
    },
  })

  const containerOptions = {
    layout: isDesktop ? DESKTOP_CONTAINER_LAYOUT : MOBILE_CONTAINER_LAYOUT,
    styles: {
      base: {
        gap: '16px',
        marginBottom: '8px',
      },
    },
    errorTextSyles: {
      base: {
        color: 'yellow',
        background: 'red',
        marginTop: '40px',
      },
    },
  }

  const container = useComposableContainer(containerOptions)

  const classes = useStyles()

  const handleCollect = async () => {
    // show error if delivery address is required and not selected
    if (selectedDelivery?.isAddrRequired && !deliveryAddress?.id) {
      dispatch(setDeliveryAddressRequiredError(true))
      toast(
        <Text variants={{ xs: 'b4', sm: 'b2' }} color="base000">
          Please add delivery address
        </Text>,
        {
          type: 'error',
          toastId: 'delivery-address-error',
          position: 'bottom-center',
          hideProgressBar: true,
          closeOnClick: true,
          autoClose: 3000,
        },
      )
      return
    }

    // collect card data
    try {
      dispatch(setSavingCard(true))
      const response = (await container?.collect()) as TGetSkyFlowRecordsRes

      if (!response || !response.records) return

      const payload = {
        serviceId: response.records[0].fields.skyflow_id,
      }

      dispatch(saveCardAsync(payload))
    } catch (e) {
      handleActionErrors({ e, dispatch })
    } finally {
      dispatch(setSavingCard(false))
    }
  }

  // check if form is valid
  const handleChange = (event: unknown) => {
    const typedEvent = event as SkyFlowChangeEvent

    if (typedEvent.elementType === 'CARD_NUMBER') setCardNumberValid(typedEvent.isValid)
    if (typedEvent.elementType === 'CVV') setCvvValid(typedEvent.isValid)
    if (typedEvent.elementType === 'EXPIRATION_MONTH')
      setExpirationMonthValid(typedEvent.isValid)
    if (typedEvent.elementType === 'EXPIRATION_YEAR')
      setExpirationYearValid(typedEvent.isValid)
    if (typedEvent.elementType === 'CARDHOLDER_NAME')
      setCardHolderNameValid(typedEvent.isValid)
  }

  const isFormValid =
    isCardNumberValid &&
    isCvvValid &&
    isExpirationMonthValid &&
    isExpirationYearValid &&
    isCardHolderNameValid

  return (
    <Container isDesktop={isDesktop}>
      <ComposableContainer id="compose-container" container={container}>
        <CardNumberElement
          label="Credit Card Number"
          id="collectCardNumber"
          container={container}
          table={SKY_FLOW_TABLE}
          classes={classes}
          placeholder="0000 0000 0000 0000"
          column="number"
          options={{ enableCardIcon: false, required: true }}
          onChange={handleChange}
        />
        <ExpirationMonthElement
          label="Expiration Month"
          id="expMonth"
          container={container}
          table={SKY_FLOW_TABLE}
          classes={classes}
          placeholder="MM"
          column="expire_month"
          options={{ required: true }}
          onChange={handleChange}
        />
        <ExpirationYearElement
          label="Expiration Year"
          id="expYear"
          container={container}
          table={SKY_FLOW_TABLE}
          classes={classes}
          placeholder="YY"
          column="expire_year"
          options={{ required: true }}
          onChange={handleChange}
        />
        <CVVElement
          label="CVV"
          id="cvv"
          container={container}
          classes={classes}
          table={SKY_FLOW_TABLE}
          placeholder="XXX"
          column="cvv"
          options={{ required: true }}
          onChange={handleChange}
        />
        <CardHolderNameElement
          id="card_holder_name"
          container={container}
          classes={classes}
          table={SKY_FLOW_TABLE}
          column="holder_name"
          label="Card Holder Name"
          placeholder="Enter your name"
          options={{ required: true }}
          onChange={handleChange}
        />
      </ComposableContainer>
      <span>
        <Button
          loading={savingCard}
          size="l"
          variant="primary"
          width="100%"
          onClick={handleCollect}
          disabled={!isFormValid}
        >
          {t('confirm')}
        </Button>
      </span>
    </Container>
  )
}
