import { useEffect, useState, useRef, useCallback } from 'react'
import { Button } from '@/components/buttons/Button'
import { useCurrencies } from '@/features/trade/hooks/create-order/use-currencies'
import { usePair } from '@/features/trade/hooks/pair/use-pair'
import { usePairName } from '@/features/trade/hooks/pair/use-pair-name'
import { useBalance } from '@/features/trade/hooks/create-order/use-balance'
import { useRange } from '@/features/trade/hooks/create-order/use-range'
import { useConfirm } from '@/features/trade/hooks/create-order/use-confirm'
import { useFetching } from '@/features/trade/hooks/create-order/use-fetching'
import { useFee } from '@/features/trade/hooks/create-order/use-fee'
import { useAuth } from '@/hooks/useAuth'
import { FormikInput } from '@/components/inputs/FormikInput'
import { ROUTES } from '@/routes'
import { ButtonText } from '@/components/buttons/ButtonText'
import { useFormik } from 'formik'
import useTranslation from 'next-translate/useTranslation'
import { Range } from '@/features/trade/containers/create-order/Range'
import {
  TFields,
  TChangeFieldProps
} from '@/features/trade/containers/create-order/FormLimit/types'
import { FormikOrder } from '@/features/trade/utils/formik-order'
import {
  QUANTITY_FIELD,
  PRICE_FIELD,
  TOTAL_FIELD
} from '@/features/trade/containers/create-order/constants'
import { useSide } from '@/features/trade/hooks/create-order/use-side'
import { TSelectEvent } from '@/components/inputs/selects/types'
import { reset } from '@/features/trade/store/create-order'
import { calcQuantity } from './utils/calc-quantity'
import { calcTotal } from './utils/calc-total'
import s from './FormMarket.module.scss'
import { TPriority, EPriority } from './types'
import { Select } from './components/Select'
import { calcRangeByFields } from '../utils/calc-range-by-fields'

export const FormMarket: React.FC = () => {
  const { t } = useTranslation('trade')
  const { fetching } = useFetching()
  const { mainCurrency, baseCurrency } = useCurrencies()
  const { side } = useSide()
  const { balance } = useBalance()
  const { pair } = usePair()
  const { pairName } = usePairName()
  const { setRange } = useRange()
  const { setConfirm } = useConfirm()
  const { user } = useAuth()
  const { fee } = useFee()

  const [submitDisabled, setSubmitDisabled] = useState(true)
  const [priority, setPriority] = useState<TPriority>('total')
  const direction = useRef<'total' | 'quantity' | null>(null)

  const formik = useFormik({
    validateOnBlur: false,
    validateOnMount: false,
    validateOnChange: false,
    initialValues: {
      [QUANTITY_FIELD]: '',
      [PRICE_FIELD]: '',
      [TOTAL_FIELD]: ''
    },
    onSubmit: (formData) => {
      const rate = formData.rate || pair?.lastPrice || ''

      setConfirm({
        [TOTAL_FIELD]: priority === 'total' ? formData[TOTAL_FIELD] : '',
        [QUANTITY_FIELD]: priority === 'amount' ? formData[QUANTITY_FIELD] : '',
        rate
      })

      formik.setSubmitting(false)
    }
  })

  useEffect(() => {
    FormikOrder.set(formik)

    return () => {
      FormikOrder.remove()
      reset()
    }
  }, [])

  useEffect(() => {
    formik.resetForm()
    setSubmitDisabled(true)
    direction.current = null
    setRange({ percent: ['0'] })
    setPriority(EPriority.total)
  }, [side, pairName])

  // count 'total' price from 'quantity' & 'price'
  const countTotal = (props: TChangeFieldProps) => {
    if (!pair) return

    direction.current = 'total'

    const { name, value, notCalcRange } = props

    const fields = {
      ...(formik.getFieldProps([QUANTITY_FIELD, PRICE_FIELD, TOTAL_FIELD])
        .value as TFields),
      ...(name && { [name]: value })
    }

    const total = calcTotal({ pair, fields })

    setSubmitDisabled(!total)

    formik.setFieldValue(TOTAL_FIELD, total)

    if (notCalcRange) return

    const range = calcRangeByFields({
      balance,
      side,
      fields: { ...fields, total }
    })

    setRange({ percent: [range], fromFields: true })
  }

  // count 'quantity' from 'total'
  const countQuantity = (props: TChangeFieldProps) => {
    const { name, value, notCalcRange } = props

    direction.current = 'quantity'

    const fields = {
      ...(formik.getFieldProps([QUANTITY_FIELD, PRICE_FIELD, TOTAL_FIELD])
        .value as TFields),
      ...(name && { [name]: value })
    }

    const result = calcQuantity({ pair, fields })

    setSubmitDisabled(!result.amount)

    formik.setValues(result)

    if (notCalcRange) return

    const range = calcRangeByFields({
      balance,
      side,
      fields: result
    })

    setRange({ percent: [range], fromFields: true })
  }

  const changePriority = useCallback((e: TSelectEvent) => {
    const val = e?.value as TPriority
    setPriority(val)
  }, [])

  const currencySelect = [
    { value: EPriority.total, label: baseCurrency?.code.toUpperCase() },
    { value: EPriority.amount, label: mainCurrency?.code.toUpperCase() }
  ]

  const hideQuantity = priority === 'total'
  const hideTotal = priority === 'amount'

  return (
    <form
      autoComplete="off"
      id="form_market"
      className={s.form}
      onSubmit={formik.handleSubmit}
    >
      <div className={s.range}>
        <Range formik={formik} countTotal={countTotal} countQuantity={countQuantity} />
      </div>

      {!hideTotal && (
        <div className={s.field}>
          <FormikInput
            theme="primary-small"
            name={TOTAL_FIELD}
            type="number"
            label={{ label: t('create-order.amount') }}
            placeholder={t('create-order.input-placeholder')}
            style={{ margin: 0, paddingRight: '50px' }}
            id={TOTAL_FIELD}
            formik={formik}
            disabled={formik.isSubmitting}
            onChange={(e) => {
              const { name, value } = e.target
              countQuantity({ name, value })
            }}
            decimals={pair?.totalDecimals}
            readOnly={fetching}
          />

          <div className={s.amount}>
            <Select
              theme="primary-small"
              name="priority"
              id="priority"
              defaultValue={currencySelect[0]}
              clear={currencySelect[0].label !== undefined}
              options={currencySelect}
              border={false}
              onChange={changePriority}
            />
          </div>
        </div>
      )}
      {!hideQuantity && (
        <div className={s.field}>
          <FormikInput
            theme="primary-small"
            name={QUANTITY_FIELD}
            type="number"
            decimals={pair?.quantityDecimals}
            label={{ label: t('create-order.amount') }}
            placeholder={t('create-order.input-placeholder')}
            style={{ margin: 0, paddingRight: '50px' }}
            id={QUANTITY_FIELD}
            formik={formik}
            disabled={formik.isSubmitting}
            onChange={(e) => {
              const { name, value } = e.target
              countTotal({ name, value })
            }}
            readOnly={fetching}
          />
          <div className={s.amount}>
            <Select
              theme="primary-small"
              name="priority"
              id="priority"
              defaultValue={currencySelect[1]}
              clear={currencySelect[1].label !== undefined}
              options={currencySelect}
              border={false}
              onChange={changePriority}
            />
          </div>
        </div>
      )}

      <div className={s.field}>
        <FormikInput
          theme="primary-small"
          name={PRICE_FIELD}
          type="number"
          label={{ label: t('create-order.price') }}
          placeholder={pair?.lastPrice}
          style={{ margin: 0, paddingRight: '50px' }}
          id={PRICE_FIELD}
          formik={formik}
          disabled
          onChange={(e) => {
            const { name, value } = e.target
            countTotal({ name, value })
          }}
          decimals={pair?.priceDecimals}
          readOnly={fetching}
        />
        <div className={s.currency}>{baseCurrency?.code}</div>
      </div>

      <div className={s.fee}>
        <span>{t('create-order.fee')}:</span>
        <>
          <span className={s.feeText}>{fee}</span>
          <span className={s.q}>%</span>
        </>
      </div>

      <div className={s.submit}>
        {user && (
          <Button
            id="submit_market"
            theme={side === 'bid' ? 'green-small' : 'red-small'}
            type="submit"
            label={
              side === 'bid' ? t('create-order.buy-btn') : t('create-order.sell-btn')
            }
            width="100%"
            loading={formik.isSubmitting}
            disabled={submitDisabled || fetching || !Number(balance?.availableBalance)}
          />
        )}

        {!user && (
          <div className={s.notAuth}>
            <ButtonText
              id="sign_in"
              label="Sign in"
              theme="white"
              underline
              font="text-small"
              linkTo={ROUTES.SIGN_IN}
            />
            <span>or</span>
            <ButtonText
              id="register"
              label="Register"
              theme="white"
              underline
              font="text-small"
              linkTo={ROUTES.SIGN_UP}
            />
          </div>
        )}
      </div>
    </form>
  )
}
