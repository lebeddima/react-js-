import { useEffect, useState, useRef } from 'react'
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
import { calcQuantity } from './utils/calc-quantity'
import { calcTotal } from './utils/calc-total'

import s from './FormLimit.module.scss'
import { calcRangeByFields } from '../utils/calc-range-by-fields'

export const FormLimit: React.FC = () => {
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
      setConfirm({ ...formData, rate })
      formik.setSubmitting(false)
    }
  })

  useEffect(() => {
    FormikOrder.set(formik)

    return () => {
      FormikOrder.remove()
    }
  }, [])

  useEffect(() => {
    formik.resetForm()
    setSubmitDisabled(true)
    direction.current = null
    setRange({ percent: ['0'] })
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
  // count 'total' price from 'quantity' & 'price'
  // end

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
  // count 'quantity' from 'total'
  // end

  // price change logic
  useEffect(() => {
    if (formik.getFieldMeta(PRICE_FIELD).touched) return
    formik.setFieldValue(PRICE_FIELD, pair?.lastPrice)

    if (direction.current === 'total') {
      countTotal({ name: PRICE_FIELD, value: pair?.lastPrice })
    }

    if (direction.current === 'quantity') {
      countQuantity({ name: PRICE_FIELD, value: pair?.lastPrice })
    }
  }, [pair?.lastPrice])

  useEffect(() => {
    formik.setFieldValue(PRICE_FIELD, pair?.lastPrice)
  }, [side])

  const setPriceTouched = () => {
    formik.setTouched({ ...formik.touched, [PRICE_FIELD]: true })
  }

  const onFocusPrice = () => {
    setPriceTouched()
  }
  // price change logic
  // end

  return (
    <form
      autoComplete="off"
      id="limit_form"
      className={s.form}
      onSubmit={formik.handleSubmit}
    >
      <div className={s.range}>
        <Range formik={formik} countTotal={countTotal} countQuantity={countQuantity} />
      </div>

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
        <div className={s.currency}>{mainCurrency?.code}</div>
      </div>

      <div className={s.field}>
        <FormikInput
          theme="primary-small"
          name={PRICE_FIELD}
          type="number"
          label={{ label: t('create-order.price') }}
          placeholder={t('create-order.input-placeholder')}
          style={{ margin: 0, paddingRight: '50px' }}
          id={PRICE_FIELD}
          formik={formik}
          disabled={formik.isSubmitting}
          onChange={(e) => {
            const { name, value } = e.target
            countTotal({ name, value })
          }}
          onFocus={onFocusPrice}
          decimals={pair?.priceDecimals}
          readOnly={fetching}
        />
        <div className={s.currency}>{baseCurrency?.code}</div>
      </div>

      <div className={s.field}>
        <FormikInput
          theme="primary-small"
          name={TOTAL_FIELD}
          type="number"
          label={{ label: t('create-order.total') }}
          placeholder={t('create-order.input-placeholder')}
          style={{ margin: 0, paddingRight: '50px' }}
          id={TOTAL_FIELD}
          formik={formik}
          disabled={formik.isSubmitting}
          onChange={(e) => {
            let { name, value } = e.target
            if (e.currentTarget.value === '') {
              value = '0'
            }
            countQuantity({ name, value })
            if (e.currentTarget.value === '') {
              setPriceTouched()
            }
          }}
          decimals={pair?.totalDecimals}
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
            id="submit_limit"
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
