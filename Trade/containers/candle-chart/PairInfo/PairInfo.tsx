import { usePair } from '@/features/trade/hooks/pair/use-pair'
import { numberFormat } from '@/utils/number-format'
import useTranslation from 'next-translate/useTranslation'
import s from './PairInfo.module.scss'

type TProps = {
  fullScreen: JSX.Element
}

export const PairInfo: React.FC<TProps> = ({ fullScreen }) => {
  const { t } = useTranslation('trade')
  const { pair } = usePair()

  if (!pair) return null

  return (
    <div className={s.container}>
      <div className={s.indicators}>
        <div className={s.volume}>
          <div className={s.indicator_item}>
            <span className={s.indicator_title}>{`${t('chart-header.volume-24')}(${
              pair.mainCurrency.code
            })`}</span>
            <span id="main_volume" className={s.indicator_value}>
              {numberFormat(pair.mainVolume)}
            </span>
          </div>
          <div className={s.indicator_item}>
            <span className={s.indicator_title}>{`${t('chart-header.volume-24')}(${
              pair.baseCurrency.code
            })`}</span>
            <span id="base_volume" className={s.indicator_value}>
              {numberFormat(pair.baseVolume)}
            </span>
          </div>
        </div>
        <div className={s.minmax}>
          <div className={s.indicator_item}>
            <span className={s.indicator_title}>{t('chart-header.max-24')}</span>
            <span id="max_price" className={s.indicator_value}>
              {numberFormat(pair.maxPrice)}
            </span>
          </div>
          <div className={s.indicator_item}>
            <span className={s.indicator_title}>{t('chart-header.min-24')}</span>
            <span id="min_price" className={s.indicator_value}>
              {numberFormat(pair.minPrice)}
            </span>
          </div>
        </div>
      </div>
      {fullScreen}
    </div>
  )
}
