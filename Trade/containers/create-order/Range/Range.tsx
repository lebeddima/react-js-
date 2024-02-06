import { Range as ReactRange } from 'react-range'
import cn from 'classnames'
import { useRange } from '@/features/trade/hooks/create-order/use-range'
import { useBalance } from '@/features/trade/hooks/create-order/use-balance'
import { usePair } from '@/features/trade/hooks/pair/use-pair'
import { useSide } from '@/features/trade/hooks/create-order/use-side'
import { TFormik } from '@/types/formik'
import { TChangeFieldProps } from '@/features/trade/containers/create-order/FormLimit/types'
import {
  PRICE_FIELD,
  QUANTITY_FIELD,
  TOTAL_FIELD
} from '@/features/trade/containers/create-order/constants'
import { ButtonText } from '@/components/buttons/ButtonText'
import { calcFieldsByRange } from './utils/calc-fields-by-range'
import s from './Range.module.scss'

type Range = {
  disabled?: boolean
  formik: TFormik
  countTotal: (props: { name: string; value: string; notCalcRange?: boolean }) => void
  countQuantity: (props: TChangeFieldProps) => void
}

export const Range: React.FC<Range> = ({
  disabled,
  formik,
  countTotal,
  countQuantity
}) => {
  const { range, setRange } = useRange()
  const { balance } = useBalance()
  const { pair } = usePair()
  const { side } = useSide()
  const { percent } = range

  const onChange = (val: number[]) => {
    const value = [val[0].toString()]

    if (value === percent) return

    if (val[0] === 0) {
      formik.setTouched({ ...formik.touched, [PRICE_FIELD]: true })
    }

    setRange({ percent: value })

    const change = calcFieldsByRange({
      pair,
      range: value[0],
      balance,
      side
    })

    if (change?.name === QUANTITY_FIELD) {
      countTotal({ ...change, notCalcRange: true })
      formik.setFieldValue(QUANTITY_FIELD, change.value)
    }

    if (change?.name === TOTAL_FIELD) {
      countQuantity({ ...change, notCalcRange: true })
      formik.setFieldValue(TOTAL_FIELD, change.value)
    }
  }

  const disable = disabled || !balance || balance.availableBalance === '0'

  const valueRange = Number(percent[0])

  return (
    <div id="range" className={cn(s.container, { [s.disabled]: disable })}>
      <ReactRange
        step={1}
        min={0}
        max={100}
        values={valueRange <= 100 ? [valueRange] : [100]}
        onChange={onChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className={cn('rangeTrack', { [s.maxLimit]: valueRange > 100 })}
          >
            <div className={s.progress} style={{ width: `${percent[0]}%` }} />
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div {...props} className={cn('rangeThumb', { rangeThumb_disable: disabled })}>
            <div
              {...props}
              className={cn(s.thumbProcent, {
                [s.disabled]: disabled,
                [s.hide]: valueRange === 0,
                [s.right]: valueRange > 98,
                [s.overhead]: valueRange > 100
              })}
            >
              {`${percent[0]}%`}
            </div>
          </div>
        )}
        disabled={disable}
      />
      <div className={s.ruler}>
        <div className={s.rulerdata}>
          <ButtonText
            id="percent_0"
            onClick={() => onChange([0])}
            classLabel={cn({ [s.active]: valueRange > 0 })}
            label="0%"
          />
        </div>
        <div className={s.rulerdata}>
          <ButtonText
            id="percent_25"
            onClick={() => onChange([25])}
            classLabel={cn({ [s.active]: valueRange >= 25 })}
            label="25%"
          />
        </div>
        <div className={s.rulerdata}>
          <ButtonText
            id="percent_50"
            onClick={() => onChange([50])}
            classLabel={cn({ [s.active]: valueRange >= 50 })}
            label="50%"
          />
        </div>
        <div className={s.rulerdata}>
          <ButtonText
            id="percent_75"
            onClick={() => onChange([75])}
            classLabel={cn({ [s.active]: valueRange >= 75 })}
            label="75%"
          />
          <ButtonText
            id="percent_100"
            onClick={() => onChange([100])}
            classLabel={cn({ [s.active]: valueRange >= 100 })}
            label="100%"
          />
        </div>
      </div>
    </div>
  )
}
