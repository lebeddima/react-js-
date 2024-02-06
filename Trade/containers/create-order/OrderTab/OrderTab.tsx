import { CheckBox } from '@/components/inputs/CheckBox'
import useTranslation from 'next-translate/useTranslation'
import { useOrderType } from '@/features/trade/hooks/create-order/use-order-type'
import s from './OrderTab.module.scss'

export const OrderTab: React.FC = () => {
  const { t } = useTranslation('trade')
  const { orderType, setOrderType } = useOrderType()

  return (
    <div className={s.container}>
      <CheckBox
        name="market"
        value="market"
        type="radio"
        label={t('create-order.market')}
        onChange={() => setOrderType('market')}
        checked={orderType === 'market'}
        font="text-small"
        id="market"
      />
      <CheckBox
        id="limit"
        name="limit"
        value="limit"
        type="radio"
        label={t('create-order.limit')}
        onChange={() => setOrderType('limit')}
        checked={orderType === 'limit'}
        font="text-small"
      />
    </div>
  )
}
