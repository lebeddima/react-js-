import { Tab } from '@/components/navigations/Tab'
import { Button } from '@/components//buttons/Button'
import useTranslation from 'next-translate/useTranslation'
import { useSide } from '@/features/trade/hooks/create-order/use-side'
import s from './SideTab.module.scss'

export const SideTab: React.FC = () => {
  const { t } = useTranslation('trade')
  const { side, setSide } = useSide()

  return (
    <div className={s.container}>
      <Tab id="trade_tab" defaultTab={side} widthButton="156px">
        <Button
          id="bid"
          theme="tab-green-big"
          label={t('create-order.buy-btn')}
          onClick={() => setSide('bid')}
        />
        <Button
          id="ask"
          theme="tab-red-big"
          label={t('create-order.sell-btn')}
          onClick={() => setSide('ask')}
        />
      </Tab>
    </div>
  )
}
