import cn from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import { ButtonIcon } from '@/components/buttons/ButtonIcon'
import { useFilter } from '@/features/trade/hooks/order-book/use-filter'
import { TInit } from '@/features/trade/store/order-book'
import { PriceChange } from '../PriceChange'
import s from './Header.module.scss'

export const Header: React.FC = () => {
  const { t } = useTranslation('trade')
  const { filter, setFilter } = useFilter()

  const onChangeOrderTypeFilter = (filter: TInit['filter']) => {
    setFilter(filter)
  }

  return (
    <div className={s.container}>
      <div className={s.title}>
        {t('order-book.title')}
        <PriceChange className={cn(s.priceChange)} />
      </div>

      <div className={s.buttons}>
        <ButtonIcon
          id="order_all"
          theme="mini"
          icon="select-all"
          iconColor="none"
          onClick={() => onChangeOrderTypeFilter('all')}
          additionalState={filter === 'all'}
        />
        <ButtonIcon
          id="bids"
          theme="mini"
          icon="select-green"
          iconColor="none"
          onClick={() => onChangeOrderTypeFilter('bids')}
          additionalState={filter === 'bids'}
        />
        <ButtonIcon
          id="asks"
          theme="mini"
          icon="select-red"
          iconColor="none"
          onClick={() => onChangeOrderTypeFilter('asks')}
          additionalState={filter === 'asks'}
        />
      </div>
    </div>
  )
}
