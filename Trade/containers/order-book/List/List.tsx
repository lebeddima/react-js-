import { useFilter } from '@/features/trade/hooks/order-book/use-filter'
import { TInit } from '@/features/trade/store/order-book'
import { useBook } from '@/features/trade/hooks/order-book/use-book'
import cn from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import { numberFormat } from '@/utils/number-format'
import D from '@/utils/decimal'

import s from './List.module.scss'

export const List: React.FC = () => {
  const { t } = useTranslation('trade')
  const { filter } = useFilter()
  const { book } = useBook()

  const renderHeader = (type: TInit['filter']) => {
    const variant = type === 'asks' ? 'Sell' : 'Buy'

    return (
      <div
        className={cn(s.header, {
          [s.reverseRow]: filter === 'all' && type === 'asks'
        })}
      >
        <div className={cn(s.headerCell, s.volumeCell)}>
          {t('order-book.headers.volume')}
        </div>
        <div className={cn(s.headerCell)}>
          {t('order-book.headers.price', { variant })}
        </div>
      </div>
    )
  }

  const getColorClass = (type: TInit['filter']) => (type === 'asks' ? 'red' : 'green')

  const renderContent = (data: TInit['book']['asks'], type: TInit['filter']) => {
    if (!book) return false
    const colorBar = type === 'asks' ? 'red' : 'green'

    return data.map((item) => (
      <div
        className={cn(s.row, {
          [s.reverseRow]: filter === 'all' && type === 'asks'
        })}
        key={item.p}
      >
        <div id="volume" className={cn(s.headerCell, s.volumeCell)}>
          {numberFormat(item.v)}
        </div>

        <div className={s.rowContent}>
          <div id="price" className={cn(s.headerCell, s[getColorClass(type)])}>
            {numberFormat(item.p)}
          </div>
        </div>
        <div
          className={cn(s.bar, s[colorBar], {
            [s.reverseRow]: filter === 'all' && type === 'asks'
          })}
          style={{
            width: `calc(${new D(item.pr).times(100).toFixed(0)}% - 16px)`
          }}
        />
      </div>
    ))
  }

  return (
    <div className={cn(s.container, [s[`type-${filter}`]])}>
      <div className={cn(s.commonContent)}>
        <div id="bids_content" className={s.bidsContent}>
          {(filter === 'all' || filter === 'bids') && renderHeader('bids')}
          <div id="bids_list" className={s.bidsList}>
            {renderContent(book.bids, 'bids')}
          </div>
        </div>
        <div className={s.asksContent}>
          {(filter === 'all' || filter === 'asks') && renderHeader('asks')}
          <div id="asks_list" className={s.asksList}>
            {renderContent(book.asks, 'asks')}
          </div>
        </div>
      </div>
    </div>
  )
}
