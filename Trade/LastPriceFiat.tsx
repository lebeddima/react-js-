import useTranslation from 'next-translate/useTranslation'
import { usePair } from '@/features/trade/hooks/pair/use-pair'
import { numberFormat } from '@/utils/number-format'
import s from './styles/LastPriceFiat.module.scss'

export const LastPriceFiat: React.FC = () => {
  const { t } = useTranslation('trade')
  const { pair } = usePair()

  if (!pair) return null

  return (
    <div className={s.container}>
      <div className={s.item}>
        <span id="price" className={s.value}>
          {numberFormat(pair.lastPrice)}
        </span>
      </div>
      <div className={s.item}>
        <span className={s.title}>{t('last-price')}</span>
        <span id="last_price" className={s.value}>{`$${numberFormat(
          pair.lastPriceFiat
        )}`}</span>
      </div>
    </div>
  )
}
