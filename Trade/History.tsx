import { useState } from 'react'
import { Tab } from '@/components/navigations/Tab'
import { Button } from '@/components/buttons/Button'
import { useAuth } from '@/hooks/useAuth'
import useTranslation from 'next-translate/useTranslation'
import cn from 'classnames'
import { TryLogin } from './components/TryLogin'
import { usePairName } from './hooks/pair/use-pair-name'
import s from './styles/History.module.scss'

type TTab = 'open' | 'history' | 'deals'

type THistory = {
  history: (pair: string) => JSX.Element
  open: (pair: string) => JSX.Element
  deals: (pair: string) => JSX.Element
}

export const History: React.FC<THistory> = ({ history, open, deals }) => {
  const { t } = useTranslation('common')
  const { user } = useAuth()
  const { pairString: pair } = usePairName()
  const [tab, setTab] = useState<TTab>('open')

  return (
    <div className={cn(s.container, {})}>
      <div className={s.header}>
        <Tab
          id="history_tab"
          defaultTab={tab}
          notActive={!user}
          styleContainer={{ background: 'none', gap: '15px' }}
        >
          <Button
            id="open"
            theme="tab-link"
            label={t('history:tabs.open-orders')}
            onClick={() => setTab('open')}
            font="text-big"
            classButton={s.btnTab}
          />
          <Button
            id="history"
            theme="tab-link"
            label={t('history:tabs.orders-history')}
            onClick={() => setTab('history')}
            font="text-big"
            classButton={s.btnTab}
          />
          <Button
            id="deals"
            theme="tab-link"
            label={t('history:tabs.trade-history')}
            onClick={() => setTab('deals')}
            font="text-big"
            classButton={s.btnTab}
          />
        </Tab>
      </div>
      <div className={s.contentWrapper}>
        <div className={s.content}>
          {!user && <TryLogin />}
          {user && pair && (
            <>
              {tab === 'open' && open(pair)}
              {tab === 'history' && history(pair)}
              {tab === 'deals' && deals(pair)}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
