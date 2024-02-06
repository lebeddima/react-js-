import Link from 'next/link'
import cn from 'classnames'
import useTranslation from 'next-translate/useTranslation'
import { Icon } from '@/components/Icon'
import { ROUTES } from '@/routes'
import { useBalance } from '@/features/trade/hooks/create-order/use-balance'
import { useCurrencies } from '@/features/trade/hooks/create-order/use-currencies'
import { useSide } from '@/features/trade/hooks/create-order/use-side'
import s from './CurrencyHeader.module.scss'

export const CurrencyHeader: React.FC = () => {
  const { t } = useTranslation('trade')
  const { balance } = useBalance()
  const { baseCurrency, mainCurrency } = useCurrencies()
  const { side } = useSide()

  let fromCurrency = mainCurrency?.code || 'A'
  let toCurrency = baseCurrency?.code || 'A'
  if (side === 'bid') {
    fromCurrency = baseCurrency?.code || 'A'
    toCurrency = mainCurrency?.code || 'A'
  }

  return (
    <div className={s.container}>
      <div className={cn(s.currency_pair, { [s.hide]: !mainCurrency })}>
        <div id="from_currency" className={s.currency}>
          {fromCurrency.toUpperCase()}
        </div>
        <div className={s.chevron_icon}>
          <Icon id="chevron-right" fill="captions" />
        </div>
        <div id="to_currency" className={s.currency}>
          {toCurrency.toUpperCase()}
        </div>
      </div>
      {balance && (
        <div className={s.available_balance}>
          <>
            <div className={s.wallet_icon}>
              <Icon id="wallet" />
            </div>
            <div className={s.text_block}>
              <span className={s.text}>{t('create-order.available-funds')}</span>
              <span id="available_balance" className={s.amount}>
                {balance.availableBalance} {fromCurrency.toUpperCase()}
              </span>
            </div>
            <div className={s.plus_icon}>
              <Link href={ROUTES.CABINET_WALLET}>
                <a href={ROUTES.CABINET_WALLET}>
                  <Icon id="plus" />
                </a>
              </Link>
            </div>
          </>
        </div>
      )}
    </div>
  )
}
