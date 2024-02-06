import cn from 'classnames'
import { TIME_H_M_S } from '@/constants/date'
import useTranslation from 'next-translate/useTranslation'
import { usePairName } from '@/features/trade/hooks/pair/use-pair-name'
import { useDeals } from '@/features/trade/hooks/deals/use-deals'
import { format } from 'date-fns'
import { numberFormat } from '@/utils/number-format'
import s from './Deals.module.scss'

export const Deals: React.FC = () => {
  const { t, lang } = useTranslation('common')
  const { pairName } = usePairName()
  const { deals } = useDeals()

  const getColorClass = (isBuy: boolean) => (isBuy ? 'green' : 'red')

  const renderContent = () =>
    deals.map((item) => (
      <div id={`deals_${item.id}`} className={s.row} key={item.id}>
        <div className={cn(s.headerCell, s.priceCell, s[getColorClass(item.isBuy)])}>
          {numberFormat(item.p)}
        </div>
        <div className={cn(s.headerCell, s.quantityCell)}>{numberFormat(item.q)}</div>
        <div className={cn(s.headerCell, s.timeCell)}>
          {format(item.t * 1000, TIME_H_M_S[lang])}
        </div>
      </div>
    ))

  return (
    <div className={s.container}>
      <div className={s.title}>{t('market:trade-view.title')}</div>
      <div className={s.header}>
        <div id="market-trade-price" className={cn(s.headerCell, s.priceCell)}>{`${t(
          'market:trade-view.headers.price'
        )}(${pairName.base})`}</div>
        <div id="market-trade-amount" className={cn(s.headerCell, s.quantityCell)}>{`${t(
          'market:trade-view.headers.amount'
        )}(${pairName.main})`}</div>
        <div className={cn(s.headerCell, s.timeCell)}>
          {t('market:trade-view.headers.time')}
        </div>
      </div>
      <div className={s.contentWrapper}>
        <div className={s.content}>{renderContent()}</div>
      </div>
    </div>
  )
}
